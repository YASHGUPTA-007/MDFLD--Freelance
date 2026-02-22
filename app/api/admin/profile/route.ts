/**
 * @file app/api/admin/profile/route.ts
 * @description Admin Profile Update API
 *
 * PUT /api/admin/profile
 *   Body (JSON): { name?, currentPassword?, newPassword? }
 *   - Update admin name
 *   - Change password (requires currentPassword verification)
 *   - No sensitive fields returned
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

async function verifyAdmin() {
    const token = (await cookies()).get('admin_token')?.value;
    return verifyToken(token || '');
}

export async function PUT(req: NextRequest) {
    const payload = await verifyAdmin();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { name, currentPassword, newPassword } = await req.json();
        await connectDB();

        const user = await User.findById(payload.userId);
        if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        const update: Record<string, unknown> = {};

        if (name?.trim()) update.name = name.trim();

        // Password change
        if (newPassword) {
            if (!currentPassword)
                return NextResponse.json({ error: 'Current password required' }, { status: 400 });
            if (newPassword.length < 8)
                return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 });

            const valid = await bcrypt.compare(currentPassword, user.password || '');
            if (!valid)
                return NextResponse.json({ error: 'Current password is incorrect' }, { status: 401 });

            update.password = await bcrypt.hash(newPassword, 10);
        }

        if (Object.keys(update).length === 0)
            return NextResponse.json({ error: 'Nothing to update' }, { status: 400 });

        const updated = await User.findByIdAndUpdate(payload.userId, update, { new: true })
            .select('name email');

        return NextResponse.json({ user: updated });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}