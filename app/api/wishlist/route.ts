/**
 * @file app/api/wishlist/route.ts
 * @description Public Wishlist API (auth required via 'token' cookie)
 *
 * GET    /api/wishlist           → Fetch user's wishlist product IDs
 * POST   /api/wishlist           → Toggle product in wishlist (add if absent, remove if present)
 *   Body: { productId: string }
 *   Returns: { added: boolean, wishlist: string[] }
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { connectDB } from '@/lib/mongodb';
import Wishlist from '@/models/Wishlist';

async function getUser() {
    const token = (await cookies()).get('token')?.value;
    return verifyToken(token || '');
}

export async function GET() {
    const payload = await getUser();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        await connectDB();
        const wishlist = await Wishlist.findOne({ user: payload.userId }).lean();
        const products = wishlist
            ? (wishlist as { products: unknown[] }).products.map(String)
            : [];
        return NextResponse.json({ wishlist: products });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const payload = await getUser();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { productId } = await req.json();
        if (!productId) return NextResponse.json({ error: 'productId required' }, { status: 400 });

        await connectDB();

        let wishlist = await Wishlist.findOne({ user: payload.userId });

        if (!wishlist) {
            // First time — create and add
            wishlist = await Wishlist.create({ user: payload.userId, products: [productId] });
            return NextResponse.json({ added: true, wishlist: wishlist.products.map(String) });
        }

        const exists = wishlist.products.map(String).includes(productId);

        if (exists) {
            // Remove
            wishlist.products = wishlist.products.filter((p) => String(p) !== productId);
        } else {
            // Add
            wishlist.products.push(productId);
        }

        await wishlist.save();
        return NextResponse.json({ added: !exists, wishlist: wishlist.products.map(String) });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}