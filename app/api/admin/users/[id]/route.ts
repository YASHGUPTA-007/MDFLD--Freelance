/**
 * @file app/api/admin/users/[id]/route.ts
 * @description Admin User by ID API
 *
 * PUT /api/admin/users/:id
 *   Body (JSON): { role?: 'user' | 'admin', isBlocked?: boolean }
 *   - Change user role (user ↔ admin)
 *   - Block or unblock user
 *   - Cannot modify own account (prevents self-lockout)
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';

async function verifyAdmin() {
    const token = (await cookies()).get('admin_token')?.value;
    return verifyToken(token || '');
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const payload = await verifyAdmin();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    // Prevent admin from modifying their own account
    if (payload.userId === (await params).id)
        return NextResponse.json({ error: 'Cannot modify your own account' }, { status: 403 });

    try {
        const { role, isBlocked } = await req.json();

        const update: Record<string, unknown> = {};
        if (role !== undefined) {
            if (!['user', 'admin'].includes(role))
                return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
            update.role = role;
        }
        if (isBlocked !== undefined) update.isBlocked = isBlocked;

        if (Object.keys(update).length === 0)
            return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });

        await connectDB();

        const user = await User.findByIdAndUpdate(
            (await params).id,
            update,
            { new: true }
        ).select('name email role isBlocked');

        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        return NextResponse.json({ user });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}