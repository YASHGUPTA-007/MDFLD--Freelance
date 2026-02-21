import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import User from '@/models/User';
import { signToken } from '@/lib/jwt';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get('code');

    if (!code)
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/login?error=no_code`);

    try {
        // 1. Exchange code for tokens
        const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: process.env.GOOGLE_CLIENT_ID!,
                client_secret: process.env.GOOGLE_CLIENT_SECRET!,
                redirect_uri: `${process.env.NEXT_PUBLIC_URL}/api/auth/google/callback`,
                grant_type: 'authorization_code',
            }),
        });

        const tokens = await tokenRes.json();
        if (!tokens.access_token)
            return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/login?error=token_failed`);

        // 2. Get user info from Google
        const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
            headers: { Authorization: `Bearer ${tokens.access_token}` },
        });
        const googleUser = await userRes.json();

        // 3. Upsert user in MongoDB
        await connectDB();
        let user = await User.findOne({ email: googleUser.email });

        if (!user) {
            user = await User.create({
                name: googleUser.name,
                email: googleUser.email,
                googleId: googleUser.id,
                avatar: googleUser.picture,
            });
        } else if (!user.googleId) {
            // existing email/password user — link google
            user.googleId = googleUser.id;
            user.avatar = googleUser.picture;
            await user.save();
        }

        // 4. Sign JWT and set cookie
        const token = signToken({ userId: user._id.toString(), email: user.email });

        const res = NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/account`);
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
        return NextResponse.redirect(`${process.env.NEXT_PUBLIC_URL}/login?error=server_error`);
    }
}