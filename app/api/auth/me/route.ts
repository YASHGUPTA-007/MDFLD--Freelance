import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User, { IUser } from '@/models/User';

export async function GET() {
    const token = (await cookies()).get('token')?.value;
    const payload = verifyToken(token || '');
    if (!payload) return NextResponse.json({ user: null });

    await connectDB();
    const user = await User.findById(payload.userId).select('name email').lean() as Pick<IUser, 'name' | 'email'> | null;
    if (!user) return NextResponse.json({ user: null });

    return NextResponse.json({ user: { name: user.name, email: user.email } });
}