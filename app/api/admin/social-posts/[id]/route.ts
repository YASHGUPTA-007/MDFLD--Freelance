/**
 * @file app/api/admin/social-posts/[id]/route.ts
 * @description Admin Social Post by ID API
 *
 * PUT    /api/admin/social-posts/:id → Update post (if new image: delete old from Cloudinary, upload new)
 * DELETE /api/admin/social-posts/:id → Delete post + remove image from Cloudinary
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

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const payload = await verifyAdmin();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        await connectDB();
        const post = await SocialPost.findById((await params).id);
        if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

        const formData = await req.formData();
        const update: Record<string, unknown> = {};

        const instagramUrl = formData.get('instagramUrl');
        const caption = formData.get('caption');
        const isActive = formData.get('isActive');

        if (instagramUrl !== null) update.instagramUrl = instagramUrl;
        if (caption !== null) update.caption = caption;
        if (isActive !== null) update.isActive = isActive === 'true';

        // New image uploaded — delete old, upload new
        const imageFile = formData.get('image') as File | null;
        if (imageFile && imageFile.size > 0) {
            await cloudinary.uploader.destroy(post.image.public_id);
            update.image = await uploadToCloudinary(imageFile);
        }

        const updated = await SocialPost.findByIdAndUpdate((await params).id, update, { new: true });
        return NextResponse.json({ post: updated });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const payload = await verifyAdmin();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        await connectDB();
        const post = await SocialPost.findById((await params).id);
        if (!post) return NextResponse.json({ error: 'Post not found' }, { status: 404 });

        await cloudinary.uploader.destroy(post.image.public_id);
        await SocialPost.findByIdAndDelete((await params).id);

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}