/**
 * @file app/api/categories/route.ts
 * @description Public Category API (used in shop page filter dropdown)
 *
 * GET /api/categories  → Fetch all ACTIVE categories (name + slug only)
 */

import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Category from '@/models/Category';

export async function GET() {
    try {
        await connectDB();
        const categories = await Category.find({ isActive: true }).select('name slug').sort({ name: 1 });
        return NextResponse.json({ categories });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}