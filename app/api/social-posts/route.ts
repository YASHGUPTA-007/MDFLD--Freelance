/**
 * @file app/api/social-posts/route.ts
 * @description Public Social Posts API (used on landing page Instagram section)
 *
 * GET /api/social-posts        → Fetch active posts, sorted newest first
 *   Query params:
 *     ?limit=  → number of posts to return (default: all active)
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import SocialPost from '@/models/SocialPost';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = searchParams.get('limit') ? Number(searchParams.get('limit')) : 0;

        await connectDB();

        const query = SocialPost.find({ isActive: true }).sort({ createdAt: -1 });
        if (limit > 0) query.limit(limit);

        const posts = await query.select('-__v');
        return NextResponse.json({ posts });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}