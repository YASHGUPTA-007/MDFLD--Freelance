/**
 * @file app/api/admin/product/route.ts
 * @description Admin-only Product API
 *
 * GET  /api/admin/product  → Paginated + searchable product list for admin panel
 *   Query params:
 *     ?search=    → filter by title (case-insensitive)
 *     &category=  → filter by category ObjectId
 *     &status=    → 'active' | 'inactive'
 *     &page=      → page number (default 1)
 *   Always returns 30 per page.
 *
 * POST /api/admin/product → Create product (FormData, uploads ≤5 images to Cloudinary)
 *   FormData fields:
 *     title, description, price, compareAtPrice?, categoryId,
 *     brand?, team?, condition, stock, featuredImageIndex?,
 *     images (File, repeat up to 5)
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import cloudinary from '@/lib/cloudinary';

const PAGE_LIMIT = 30;

async function verifyAdmin() {
    const token = (await cookies()).get('admin_token')?.value;
    return verifyToken(token || '');
}

async function uploadToCloudinary(file: File): Promise<{ url: string; public_id: string }> {
    const buffer = Buffer.from(await file.arrayBuffer());
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            { folder: 'mdfld/products' },
            (error, result) => {
                if (error || !result) return reject(error);
                resolve({ url: result.secure_url, public_id: result.public_id });
            }
        );
        stream.end(buffer);
    });
}

// ─── GET (paginated + filtered) ───────────────────────────────────────────────
export async function GET(req: NextRequest) {
    const payload = await verifyAdmin();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { searchParams } = new URL(req.url);
        const search   = searchParams.get('search')   || '';
        const category = searchParams.get('category') || '';
        const status   = searchParams.get('status')   || ''; // 'active' | 'inactive'
        const page     = Math.max(1, Number(searchParams.get('page') || 1));
        const skip     = (page - 1) * PAGE_LIMIT;

        await connectDB();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const filter: Record<string, any> = {};
        if (search)              filter.title    = { $regex: search, $options: 'i' };
        if (category)            filter.category = category;
        if (status === 'active') filter.isActive = true;
        if (status === 'inactive') filter.isActive = false;

        const [products, total] = await Promise.all([
            Product.find(filter)
                .populate('category', 'name')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(PAGE_LIMIT)
                .select('-__v'),
            Product.countDocuments(filter),
        ]);

        // Stat counts (unfiltered totals for stat cards)
        const [totalAll, totalActive, totalLowStock] = await Promise.all([
            Product.countDocuments(),
            Product.countDocuments({ isActive: true }),
            Product.countDocuments({ stock: { $lte: 5 } }),
        ]);

        return NextResponse.json({
            products,
            pagination: {
                total,
                page,
                limit: PAGE_LIMIT,
                totalPages: Math.ceil(total / PAGE_LIMIT),
            },
            stats: {
                total: totalAll,
                active: totalActive,
                inactive: totalAll - totalActive,
                lowStock: totalLowStock,
            },
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

// ─── POST (create) ────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
    const payload = await verifyAdmin();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const formData = await req.formData();

        const title          = formData.get('title')       as string;
        const description    = formData.get('description') as string;
        const price          = Number(formData.get('price'));
        const compareAtPrice = formData.get('compareAtPrice') ? Number(formData.get('compareAtPrice')) : undefined;
        const categoryId     = formData.get('categoryId')  as string;
        const brand          = formData.get('brand')        as string | null;
        const team           = formData.get('team')         as string | null;
        const condition      = formData.get('condition')    as string;
        const stock          = Number(formData.get('stock') || 0);

        if (!title || !description || !price || !categoryId || !condition) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Upload images (max 5)
        const imageFiles = formData.getAll('images') as File[];
        const filesToUpload = imageFiles.slice(0, 5);
        const images = await Promise.all(filesToUpload.map(uploadToCloudinary));

        // Clamp featuredImageIndex to valid range
        const rawFeatured = Number(formData.get('featuredImageIndex') || 0);
        const featuredImageIndex = images.length > 0
            ? Math.min(Math.max(0, rawFeatured), images.length - 1)
            : 0;

        await connectDB();
        const product = await Product.create({
            title, description, price, compareAtPrice,
            category: categoryId,
            brand: brand || undefined,
            team:  team  || undefined,
            condition, stock, images,
            featuredImageIndex,
            createdBy: payload.userId,
        });

        return NextResponse.json({ product }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}