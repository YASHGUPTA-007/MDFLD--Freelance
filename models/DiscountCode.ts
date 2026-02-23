// models/DiscountCode.ts

import mongoose, { Schema, Document } from 'mongoose';

export interface IDiscountCode extends Document {
    code: string;
    influencerName: string;
    discountType: 'percentage';
    discountValue: number;
    isActive: boolean;
    usageLimit: number | null;
    usageCount: number;
    expiresAt: Date | null;
    minOrderAmount: number;
    stripeCouponId: string | null;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
}

const DiscountCodeSchema = new Schema<IDiscountCode>({
    code: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true,
    },
    influencerName: {
        type: String,
        required: true,
        trim: true,
    },
    discountType: {
        type: String,
        enum: ['percentage'],
        default: 'percentage',
    },
    discountValue: {
        type: Number,
        required: true,
        min: 1,
        max: 100,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    usageLimit: {
        type: Number,
        default: null, // null = unlimited
    },
    usageCount: {
        type: Number,
        default: 0,
    },
    expiresAt: {
        type: Date,
        default: null, // null = no expiration
    },
    minOrderAmount: {
        type: Number,
        default: 0,
    },
    stripeCouponId: {
        type: String,
        default: null,
    },
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.DiscountCode ||
    mongoose.model<IDiscountCode>('DiscountCode', DiscountCodeSchema);