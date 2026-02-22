/**
 * @file models/StoreSettings.ts
 * @description Store Settings model — only one document allowed (singleton)
 *
 * Fields: storeName, supportEmail, supportPhone, logo (url + public_id),
 *         accentColor, allowRegistrations, maintenanceMode
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface IStoreSettings extends Document {
    storeName: string;
    supportEmail: string;
    supportPhone?: string;
    logo?: { url: string; public_id: string };
    accentColor?: string;
    allowRegistrations: boolean;
    maintenanceMode: boolean;
    updatedAt: Date;
}

const StoreSettingsSchema = new Schema<IStoreSettings>({
    storeName: { type: String, default: 'My Store' },
    supportEmail: { type: String, default: '' },
    supportPhone: { type: String },
    logo: { url: String, public_id: String },
    accentColor: { type: String, default: '#00d4b6' },
    allowRegistrations: { type: Boolean, default: true },
    maintenanceMode: { type: Boolean, default: false },
    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.StoreSettings ||
    mongoose.model<IStoreSettings>('StoreSettings', StoreSettingsSchema);