/**
 * @file app/api/admin/activity/route.ts
 * @description Admin Activity Feed API
 *
 * GET /api/admin/activity
 *   Query params:
 *     ?limit=  → number of items (default 5)
 *     &page=   → page number for full feed (default 1)
 *
 *   Merges from existing collections (no new schema):
 *     - New users registered
 *     - New products added
 *     (Orders will be added here when order flow is built)
 *
 *   Returns items sorted by createdAt descending.
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Product from '@/models/Product';
import Order from '@/models/Order';

async function verifyAdmin() {
    const token = (await cookies()).get('admin_token')?.value;
    return verifyToken(token || '');
}

export async function GET(req: NextRequest) {
    const payload = await verifyAdmin();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { searchParams } = new URL(req.url);
        const limit = Math.max(1, Number(searchParams.get('limit') || 5));
        const page = Math.max(1, Number(searchParams.get('page') || 1));

        await connectDB();

        // Fetch recent users and products in parallel
        // Fetch more than needed so we can merge + sort + paginate properly
        const fetchCount = limit * page + 20;

        const [users, products, orders] = await Promise.all([
            User.find().select('name email createdAt').sort({ createdAt: -1 }).limit(fetchCount).lean(),
            Product.find().select('title createdAt').sort({ createdAt: -1 }).limit(fetchCount).lean(),
            Order.find().select('totalAmount createdAt').sort({ createdAt: -1 }).limit(fetchCount).lean(),
        ]);

        // Normalize into activity items
        const items = [
            ...users.map(u => ({
                type: 'user' as const,
                label: `New user registered`,
                detail: u.name,
                subdetail: u.email,
                createdAt: u.createdAt,
            })),
            ...products.map(p => ({
                type: 'product' as const,
                label: `New product added`,
                detail: p.title,
                subdetail: null,
                createdAt: p.createdAt,
            })),
            ...orders.map(o => ({
                type: 'order' as const,
                label: 'New order placed',
                detail: `£${o.totalAmount.toFixed(2)}`,
                subdetail: null,
                createdAt: o.createdAt,
            })),
        ];

        // Sort by date descending
        items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

        const total = items.length;
        const paginated = items.slice((page - 1) * limit, page * limit);

        return NextResponse.json({
            items: paginated,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}