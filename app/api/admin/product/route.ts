/**
 * @file app/api/admin/product/route.ts
 * @description Admin-only Product API
 *
 * GET  /api/admin/product  → Fetch all products (including inactive) for admin panel table
 * POST /api/admin/product  → Create a new product (accepts FormData, uploads images to Cloudinary)
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { connectDB } from '@/lib/mongodb';
import Product from '@/models/Product';
import cloudinary from '@/lib/cloudinary';

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

export async function GET() {
    const payload = await verifyAdmin();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        await connectDB();
        const products = await Product.find()
            .populate('category', 'name')
            .sort({ createdAt: -1 })
            .select('-__v');
        return NextResponse.json({ products });
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

        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const price = Number(formData.get('price'));
        const compareAtPrice = formData.get('compareAtPrice') ? Number(formData.get('compareAtPrice')) : undefined;
        const categoryId = formData.get('categoryId') as string;
        const brand = formData.get('brand') as string | undefined;
        const team = formData.get('team') as string | undefined;
        const condition = formData.get('condition') as string;
        const stock = Number(formData.get('stock') || 0);

        if (!title || !description || !price || !categoryId || !condition)
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });

        const imageFiles = formData.getAll('images') as File[];
        const images = await Promise.all(imageFiles.map(uploadToCloudinary));

        await connectDB();

        const product = await Product.create({
            title, description, price, compareAtPrice,
            category: categoryId, brand, team, condition, stock, images,
            createdBy: payload.userId,
        });

        return NextResponse.json({ product }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}