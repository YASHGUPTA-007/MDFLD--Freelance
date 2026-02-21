import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { signToken } from '@/lib/jwt';

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json();

        if (!email || !password)
            return NextResponse.json({ error: 'All fields required' }, { status: 400 });

        await connectDB();

        const user = await User.findOne({ email });
        if (!user || !user.password)
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid)
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });

        const token = signToken({ userId: user._id.toString(), email: user.email });

        const res = NextResponse.json({ success: true, user: { name: user.name, email: user.email } });
        res.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 60 * 60 * 24 * 7,
            path: '/',
        });

        return res;
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}