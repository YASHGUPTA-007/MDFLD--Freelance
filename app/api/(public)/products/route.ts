/**
 * @file app/api/products/route.ts
 * @description Public Products API (used on shop page)
 *
 * GET /api/products  → Fetch all ACTIVE products
 *   Query params:
 *     ?category=   → filter by category ObjectId
 *     &brand=      → filter by brand
 *     &team=       → filter by team
 *     &minPrice=   → minimum price
 *     &maxPrice=   → maximum price
 *     &sort=       → "low-high" | "high-low" (default: newest first)
 */

import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);

        const category = searchParams.get('category');
        const brand = searchParams.get('brand');
        const team = searchParams.get('team');
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const sort = searchParams.get('sort');

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filter: Record<string, any> = { isActive: true };

        if (category) filter.category = category;
        if (brand) filter.brand = brand;
        if (team) filter.team = team;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }

        let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
        if (sort === 'low-high') sortOption = { price: 1 };
        if (sort === 'high-low') sortOption = { price: -1 };

        await connectDB();
        const products = await Product.find(filter)
            .populate('category', 'name slug')
            .sort(sortOption)
            .select('-__v');

        return NextResponse.json({ products });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}