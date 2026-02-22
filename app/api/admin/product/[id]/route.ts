/**
 * @file app/api/admin/product/[id]/route.ts
 * @description Admin-only Product by ID API
 *
 * GET    /api/admin/product/:id  → Fetch single product by ID
 * PUT    /api/admin/product/:id  → Update product fields (if new images provided: deletes old from Cloudinary, uploads new)
 * DELETE /api/admin/product/:id  → Delete product and all its images from Cloudinary
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

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
    const payload = await verifyAdmin();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        await connectDB();
        const product = await Product.findById(params.id).populate('category', 'name').select('-__v');
        if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        return NextResponse.json({ product });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const payload = await verifyAdmin();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        await connectDB();
        const product = await Product.findById(params.id);
        if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

        const formData = await req.formData();
        const update: Record<string, unknown> = {};

        const fields = ['title', 'description', 'brand', 'team', 'condition'];
        fields.forEach(f => {
            const val = formData.get(f);
            if (val !== null) update[f] = val;
        });

        const categoryId = formData.get('categoryId');
        if (categoryId) update.category = categoryId;

        if (formData.get('price')) update.price = Number(formData.get('price'));
        if (formData.get('compareAtPrice')) update.compareAtPrice = Number(formData.get('compareAtPrice'));
        if (formData.get('stock')) update.stock = Number(formData.get('stock'));
        if (formData.get('isActive') !== null) update.isActive = formData.get('isActive') === 'true';

        // If new images uploaded — delete old from Cloudinary, upload new
        const newImageFiles = formData.getAll('images') as File[];
        if (newImageFiles.length > 0 && newImageFiles[0].size > 0) {
            await Promise.all(
                product.images.map((img: { public_id: string }) =>
                    cloudinary.uploader.destroy(img.public_id)
                )
            );
            update.images = await Promise.all(newImageFiles.map(uploadToCloudinary));
        }

        const updated = await Product.findByIdAndUpdate(params.id, update, { new: true });
        return NextResponse.json({ product: updated });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
    const payload = await verifyAdmin();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        await connectDB();
        const product = await Product.findById(params.id);
        if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

        // Delete all images from Cloudinary first
        await Promise.all(
            product.images.map((img: { public_id: string }) =>
                cloudinary.uploader.destroy(img.public_id)
            )
        );

        await Product.findByIdAndDelete(params.id);
        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}