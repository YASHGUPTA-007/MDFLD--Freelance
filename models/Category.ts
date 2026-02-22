// models/Category.ts

import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
    name: string;
    slug: string;
    isActive: boolean;
    createdAt: Date;
}

const CategorySchema = new Schema<ICategory>({
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Category ||
    mongoose.model<ICategory>("Category", CategorySchema);