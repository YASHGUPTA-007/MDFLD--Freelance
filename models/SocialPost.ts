/**
 * @file models/SocialPost.ts
 * @description SocialPost model — powers the Instagram section on landing page
 *
 * Fields: image (url + public_id), instagramUrl, caption, isActive, createdAt
 */

import mongoose, { Schema, Document } from 'mongoose';

export interface ISocialPost extends Document {
    image: { url: string; public_id: string };
    instagramUrl: string;
    caption?: string;
    isActive: boolean;
    createdAt: Date;
}

const SocialPostSchema = new Schema<ISocialPost>({
    image: {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
    },
    instagramUrl: { type: String, required: true },
    caption: { type: String },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.SocialPost ||
    mongoose.model<ISocialPost>('SocialPost', SocialPostSchema);