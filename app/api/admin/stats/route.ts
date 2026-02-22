/**
 * @file app/api/admin/stats/route.ts
 * @description Admin Dashboard Stats API
 *
 * GET /api/admin/stats
 *   Returns:
 *     - totalUsers
 *     - totalProducts
 *     - totalCategories
 *     - totalOrders
 *     - revenue (sum of paid orders)
 */

import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Order from '@/models/Order';

async function verifyAdmin() {
    const token = (await cookies()).get('admin_token')?.value;
    return verifyToken(token || '');
}

export async function GET() {
    const payload = await verifyAdmin();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        await connectDB();

        const [totalUsers, totalProducts, totalCategories, totalOrders, revenueData] = await Promise.all([
            User.countDocuments(),
            Product.countDocuments(),
            Category.countDocuments({ isActive: true }),
            Order.countDocuments(),
            Order.aggregate([
                { $match: { paymentStatus: 'paid' } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } },
            ]),
        ]);

        const revenue = revenueData[0]?.total ?? 0;

        return NextResponse.json({ totalUsers, totalProducts, totalCategories, totalOrders, revenue });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}