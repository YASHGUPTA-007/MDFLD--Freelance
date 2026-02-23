// /**
//  * @file app/api/admin/category/route.ts
//  * @description Admin-only Category API
//  *
//  * GET  /api/admin/category  → Fetch all categories (including inactive) for admin panel table
//  * POST /api/admin/category  → Create a new category (auto-generates slug from name)
//  */

// import { NextRequest, NextResponse } from 'next/server';
// import { cookies } from 'next/headers';
// import { verifyToken } from '@/lib/jwt';
// import { connectDB } from '@/lib/mongodb';
// import Category from '@/models/Category';

// async function verifyAdmin() {
//     const token = (await cookies()).get('admin_token')?.value;
//     return verifyToken(token || '');
// }

// export async function GET() {
//     const payload = await verifyAdmin();
//     if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

//     try {
//         await connectDB();
//         const categories = await Category.find().sort({ createdAt: -1 });
//         return NextResponse.json({ categories });
//     } catch (err) {
//         console.error(err);
//         return NextResponse.json({ error: 'Server error' }, { status: 500 });
//     }
// }

// export async function POST(req: NextRequest) {
//     const payload = await verifyAdmin();
//     if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

//     try {
//         const { name } = await req.json();
//         if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

//         const slug = name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

//         await connectDB();

//         const exists = await Category.findOne({ $or: [{ name }, { slug }] });
//         if (exists) return NextResponse.json({ error: 'Category already exists' }, { status: 409 });

//         const category = await Category.create({ name, slug });
//         return NextResponse.json({ category }, { status: 201 });
//     } catch (err) {
//         console.error(err);
//         return NextResponse.json({ error: 'Server error' }, { status: 500 });
//     }
// }

/**
 * @file app/api/admin/category/route.ts
 *
 * GET  /api/admin/category  → All categories with productCount per category
 * POST /api/admin/category  → Create new category
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';
import Product from '@/models/Product';

async function verifyAdmin() {
    const token = (await cookies()).get('admin_token')?.value;
    return verifyToken(token || '');
}

export async function GET() {
    const payload = await verifyAdmin();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        await connectDB();

        const categories = await Category.find().sort({ createdAt: -1 }).lean();

        // Aggregate product count per category in one query
        const counts = await Product.aggregate([
            { $group: { _id: '$category', count: { $sum: 1 } } },
        ]);

        const countMap = new Map(counts.map(c => [c._id.toString(), c.count]));

        const enriched = categories.map(cat => ({
            ...cat,
            productCount: countMap.get((cat._id as string).toString()) ?? 0,
        }));

        return NextResponse.json({ categories: enriched });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const payload = await verifyAdmin();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { name } = await req.json();
        if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 });

        const slug = name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        await connectDB();

        const exists = await Category.findOne({ $or: [{ name }, { slug }] });
        if (exists) return NextResponse.json({ error: 'Category already exists' }, { status: 409 });

        const category = await Category.create({ name, slug });
        return NextResponse.json({ category }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}