/**
 * @file app/api/admin/discounts/[id]/route.ts
 *
 * PUT   /api/admin/discounts/:id  → Update discount (recreates Stripe coupon if % or limit changes)
 * DELETE /api/admin/discounts/:id → Delete discount + Stripe coupon
 * PATCH  /api/admin/discounts/:id → Toggle isActive
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { connectDB } from '@/lib/mongodb';
import DiscountCode from '@/models/DiscountCode';
import { createStripeCoupon, deleteStripeCoupon } from '@/lib/stripe';
import mongoose from 'mongoose';

async function verifyAdmin() {
    const token = (await cookies()).get('admin_token')?.value;
    return verifyToken(token || '');
}

// ─── PUT (Update) ─────────────────────────────────────────────────────────────
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const payload = await verifyAdmin();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    try {
        await connectDB();

        const discount = await DiscountCode.findById(id);
        if (!discount) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        const { influencerName, discountValue, expiresAt, usageLimit, minOrderAmount, isActive } =
            await req.json();

        const newPct = discountValue !== undefined ? Number(discountValue) : discount.discountValue;
        const newLimit = usageLimit !== undefined ? (usageLimit ? Number(usageLimit) : null) : discount.usageLimit;

        const pctChanged = newPct !== discount.discountValue;
        const limitChanged = newLimit !== discount.usageLimit;

        // If percentage or usage limit changed → delete old Stripe coupon + create new one
        if (pctChanged || limitChanged) {
            if (newPct < 1 || newPct > 100) {
                return NextResponse.json(
                    { error: 'Discount value must be between 1 and 100' },
                    { status: 400 }
                );
            }

            if (discount.stripeCouponId) {
                await deleteStripeCoupon(discount.stripeCouponId);
            }

            try {
                const newCoupon = await createStripeCoupon(discount.code, newPct, newLimit);
                discount.stripeCouponId = newCoupon.id;
            } catch (err: unknown) {
                const msg = err instanceof Error ? err.message : 'Stripe coupon creation failed';
                return NextResponse.json({ error: msg }, { status: 500 });
            }

            discount.discountValue = newPct;
            discount.usageLimit = newLimit;
        }

        // Update remaining fields
        if (influencerName !== undefined) discount.influencerName = influencerName;
        if (expiresAt !== undefined) discount.expiresAt = expiresAt || null;
        if (minOrderAmount !== undefined) discount.minOrderAmount = Number(minOrderAmount) || 0;
        if (isActive !== undefined) discount.isActive = isActive;

        await discount.save();

        const populated = await DiscountCode.findById(id).populate('createdBy', 'name email');
        return NextResponse.json({ discount: populated });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

// ─── DELETE ───────────────────────────────────────────────────────────────────
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const payload = await verifyAdmin();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    try {
        await connectDB();

        const discount = await DiscountCode.findById(id);
        if (!discount) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        // Delete from Stripe first
        if (discount.stripeCouponId) {
            await deleteStripeCoupon(discount.stripeCouponId);
        }

        await DiscountCode.findByIdAndDelete(id);
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

// ─── PATCH (Toggle isActive) ──────────────────────────────────────────────────
export async function PATCH(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const payload = await verifyAdmin();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { id } = await params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });
    }

    try {
        await connectDB();

        const discount = await DiscountCode.findById(id);
        if (!discount) return NextResponse.json({ error: 'Not found' }, { status: 404 });

        discount.isActive = !discount.isActive;
        await discount.save();

        return NextResponse.json({ isActive: discount.isActive });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}