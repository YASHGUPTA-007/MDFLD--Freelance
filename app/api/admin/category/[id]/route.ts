/**
 * @file app/api/admin/category/[id]/route.ts
 * @description Admin-only Category by ID API
 *
 * PUT    /api/admin/category/:id  → Update category name, slug (auto-regenerated), or isActive status
 * DELETE /api/admin/category/:id  → Delete category (blocked if any product is using it)
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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const payload = await verifyAdmin();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        const { name, isActive } = await req.json();
        await connectDB();

        const update: Record<string, unknown> = {};
        if (name !== undefined) {
            update.name = name;
            update.slug = name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
        }
        if (isActive !== undefined) update.isActive = isActive;

        const category = await Category.findByIdAndUpdate(params.id, update, { new: true });
        if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });

        return NextResponse.json({ category });
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

        const inUse = await Product.exists({ category: params.id });
        if (inUse) return NextResponse.json({ error: 'Category is in use by products' }, { status: 409 });

        const category = await Category.findByIdAndDelete(params.id);
        if (!category) return NextResponse.json({ error: 'Category not found' }, { status: 404 });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}