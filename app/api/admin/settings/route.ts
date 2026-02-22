/**
 * @file app/api/admin/settings/route.ts
 * @description Admin Store Settings API
 *
 * GET /api/admin/settings → fetch store settings (creates default if none exist)
 * PUT /api/admin/settings → update store settings (logo upload to Cloudinary if provided)
 */

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/jwt';
import { connectDB } from '@/lib/mongodb';
import StoreSettings from '@/models/StoreSettings';
import cloudinary from '@/lib/cloudinary';

async function verifyAdmin() {
    const token = (await cookies()).get('admin_token')?.value;
    return verifyToken(token || '');
}

async function getOrCreateSettings() {
    let settings = await StoreSettings.findOne();
    if (!settings) settings = await StoreSettings.create({});
    return settings;
}

export async function GET() {
    const payload = await verifyAdmin();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        await connectDB();
        const settings = await getOrCreateSettings();
        return NextResponse.json({ settings });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    const payload = await verifyAdmin();
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    try {
        await connectDB();
        const formData = await req.formData();

        const update: Record<string, unknown> = { updatedAt: new Date() };

        const fields = ['storeName', 'supportEmail', 'supportPhone', 'accentColor'];
        fields.forEach(f => {
            const val = formData.get(f);
            if (val !== null) update[f] = val;
        });

        if (formData.get('allowRegistrations') !== null)
            update.allowRegistrations = formData.get('allowRegistrations') === 'true';
        if (formData.get('maintenanceMode') !== null)
            update.maintenanceMode = formData.get('maintenanceMode') === 'true';

        // Logo upload
        const logoFile = formData.get('logo') as File | null;
        if (logoFile && logoFile.size > 0) {
            const settings = await getOrCreateSettings();

            // Delete old logo from Cloudinary
            if (settings.logo?.public_id) {
                await cloudinary.uploader.destroy(settings.logo.public_id);
            }

            const buffer = Buffer.from(await logoFile.arrayBuffer());
            const uploaded = await new Promise<{ url: string; public_id: string }>((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'mdfld/store' },
                    (error, result) => {
                        if (error || !result) return reject(error);
                        resolve({ url: result.secure_url, public_id: result.public_id });
                    }
                );
                stream.end(buffer);
            });

            update.logo = uploaded;
        }

        const settings = await StoreSettings.findOneAndUpdate(
            {},
            update,
            { new: true, upsert: true }
        );

        return NextResponse.json({ settings });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}