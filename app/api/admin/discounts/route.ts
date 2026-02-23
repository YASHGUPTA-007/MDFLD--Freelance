/**
 * @file app/api/admin/discounts/route.ts
 *
 * GET  /api/admin/discounts  → All discount codes (admin only)
 * POST /api/admin/discounts  → Create discount code + Stripe coupon
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { connectDB } from '@/lib/mongodb';
import DiscountCode from '@/models/DiscountCode';
import { createStripeCoupon } from '@/lib/stripe';

async function verifyAdmin() {
    const token = (await cookies()).get('admin_token')?.value;
    return verifyToken(token || '');
}

// ─── GET ──────────────────────────────────────────────────────────────────────
export async function GET() {
    const payload = await verifyAdmin();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        await connectDB();
        const discounts = await DiscountCode.find()
            .populate('createdBy', 'name email')
            .sort({ createdAt: -1 });

        return NextResponse.json({ discounts });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

// ─── POST ─────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
    const payload = await verifyAdmin();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { code, influencerName, discountValue, expiresAt, usageLimit, minOrderAmount } =
            await req.json();

        // Validation
        if (!code || !influencerName || !discountValue) {
            return NextResponse.json(
                { error: 'Code, influencer name, and discount value are required' },
                { status: 400 }
            );
        }

        const pct = Number(discountValue);
        if (pct < 1 || pct > 100) {
            return NextResponse.json(
                { error: 'Discount value must be between 1 and 100' },
                { status: 400 }
            );
        }

        await connectDB();

        const upperCode = (code as string).toUpperCase().trim();

        const exists = await DiscountCode.findOne({ code: upperCode });
        if (exists) {
            return NextResponse.json({ error: 'Discount code already exists' }, { status: 409 });
        }

        // Create Stripe coupon first
        let stripeCoupon;
        try {
            stripeCoupon = await createStripeCoupon(
                upperCode,
                pct,
                usageLimit ? Number(usageLimit) : null
            );
        } catch (err: unknown) {
            const msg = err instanceof Error ? err.message : 'Stripe coupon creation failed';
            return NextResponse.json({ error: msg }, { status: 500 });
        }

        // Save to DB
        const discount = await DiscountCode.create({
            code: upperCode,
            influencerName,
            discountType: 'percentage',
            discountValue: pct,
            expiresAt: expiresAt || null,
            usageLimit: usageLimit ? Number(usageLimit) : null,
            minOrderAmount: minOrderAmount ? Number(minOrderAmount) : 0,
            stripeCouponId: stripeCoupon.id,
            createdBy: payload.userId,
        });

        const populated = await DiscountCode.findById(discount._id).populate('createdBy', 'name email');

        return NextResponse.json({ discount: populated }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}