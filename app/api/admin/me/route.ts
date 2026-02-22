import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User, { IUser } from '@/models/User';

export async function GET() {
    const token = (await cookies()).get('admin_token')?.value;
    const payload = verifyToken(token || '');
    if (!payload) return NextResponse.json({ user: null }, { status: 401 });

    await connectDB();
    const user = await User.findById(payload.userId).select('name email role').lean() as Pick<IUser, 'name' | 'email' | 'role'> | null;
    if (!user) return NextResponse.json({ user: null }, { status: 401 });
    
    // Verify admin role
    if (user.role !== 'admin') return NextResponse.json({ user: null }, { status: 403 });

    return NextResponse.json({ user: { name: user.name, email: user.email, role: user.role } });
}
