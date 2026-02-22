/**
 * @file app/api/products/[id]/route.ts
 * @description Public Single Product API (used on product detail page)
 *
 * GET /api/products/:id  → Fetch a single product by ID (with category populated)
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await connectDB();
        const product = await Product.findById((await params).id)
            .populate('category', 'name slug')
            .select('-__v');

        if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        return NextResponse.json({ product });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}