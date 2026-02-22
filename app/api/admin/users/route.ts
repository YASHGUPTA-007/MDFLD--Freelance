/**
 * @file app/api/admin/users/route.ts
 * @description Admin Users API
 *
 * GET /api/admin/users
 *   Query params:
 *     ?search=   → search by name or email (case-insensitive)
 *     &page=     → page number (default 1)
 *     &limit=    → results per page (default 10)
 *
 *   Returns per user:
 *     - name, email, avatar, role, isBlocked, createdAt
 *     - totalOrders, totalSpent (sum of paid orders), refundCount (cancelled orders)
 *
 * No sensitive fields (password, googleId) returned.
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import Order from '@/models/Order';
import mongoose from 'mongoose';

async function verifyAdmin() {
    const token = (await cookies()).get('admin_token')?.value;
    return verifyToken(token || '');
}

export async function GET(req: NextRequest) {
    const payload = await verifyAdmin();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { searchParams } = new URL(req.url);
        const search = searchParams.get('search') || '';
        const page = Math.max(1, Number(searchParams.get('page') || 1));
        const limit = Math.max(1, Number(searchParams.get('limit') || 10));
        const skip = (page - 1) * limit;

        await connectDB();

        // Build search filter
        const searchFilter = search
            ? {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                ],
            }
            : {};

        const [users, total] = await Promise.all([
            User.find(searchFilter)
                .select('name email avatar role isBlocked createdAt')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            User.countDocuments(searchFilter),
        ]);

        // Aggregate order stats for fetched users
        const userIds = users.map(u => u._id as mongoose.Types.ObjectId);

        const orderStats = await Order.aggregate([
            { $match: { user: { $in: userIds } } },
            {
                $group: {
                    _id: '$user',
                    totalOrders: { $sum: 1 },
                    totalSpent: {
                        $sum: {
                            $cond: [{ $eq: ['$paymentStatus', 'paid'] }, '$totalAmount', 0],
                        },
                    },
                    refundCount: {
                        $sum: {
                            $cond: [{ $eq: ['$orderStatus', 'cancelled'] }, 1, 0],
                        },
                    },
                },
            },
        ]);

        // Map stats by userId
        const statsMap = new Map(
            orderStats.map(s => [s._id.toString(), s])
        );

        const enriched = users.map(u => {
            const stats = statsMap.get((u._id as mongoose.Types.ObjectId).toString());
            return {
                ...u,
                totalOrders: stats?.totalOrders ?? 0,
                totalSpent: stats?.totalSpent ?? 0,
                refundCount: stats?.refundCount ?? 0,
            };
        });

        return NextResponse.json({
            users: enriched,
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