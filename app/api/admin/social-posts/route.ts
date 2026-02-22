/**
 * @file app/api/admin/social-posts/route.ts
 * @description Admin Social Posts API
 *
 * GET  /api/admin/social-posts → Fetch all posts (including inactive) for admin panel
 * POST /api/admin/social-posts → Create new post (upload image to Cloudinary)
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { connectDB } from '@/lib/mongodb';
import SocialPost from '@/models/SocialPost';
import cloudinary from '@/lib/cloudinary';

async function verifyAdmin() {
    const token = (await cookies()).get('admin_token')?.value;
    return verifyToken(token || '');
}

async function uploadToCloudinary(file: File): Promise<{ url: string; public_id: string }> {
    const buffer = Buffer.from(await file.arrayBuffer());
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'mdfld/social' },
            (error, result) => {
                if (error || !result) return reject(error);
                resolve({ url: result.secure_url, public_id: result.public_id });
            }
        );
        stream.end(buffer);
    });
}

export async function GET() {
    const payload = await verifyAdmin();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        await connectDB();
        const posts = await SocialPost.find().sort({ createdAt: -1 }).select('-__v');
        return NextResponse.json({ posts });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const payload = await verifyAdmin();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const formData = await req.formData();
        const instagramUrl = formData.get('instagramUrl') as string;
        const caption = formData.get('caption') as string | undefined;
        const isActive = formData.get('isActive') !== 'false';
        const imageFile = formData.get('image') as File | null;

        if (!instagramUrl) return NextResponse.json({ error: 'Instagram URL is required' }, { status: 400 });
        if (!imageFile || imageFile.size === 0) return NextResponse.json({ error: 'Image is required' }, { status: 400 });

        const image = await uploadToCloudinary(imageFile);

        await connectDB();
        const post = await SocialPost.create({ image, instagramUrl, caption, isActive });
        return NextResponse.json({ post }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}