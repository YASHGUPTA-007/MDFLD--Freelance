// models/Product.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
    title: string;
    description: string;
    price: number;
    compareAtPrice?: number;
    category: mongoose.Types.ObjectId;
    brand?: string;
    team?: string;
    condition: "Brand New" | "New with Tags" | "Used - Like New" | "Used - Good";
    stock: number;
    images: {
        url: string;
        public_id: string;
    }[];
    featuredImageIndex: number; // ← NEW: index into images[] that is the hero/featured image
    isActive: boolean;
    createdBy: mongoose.Types.ObjectId;
    createdAt: Date;
}

const ProductSchema = new Schema<IProduct>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    compareAtPrice: { type: Number },

    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },

    brand: { type: String },
    team: { type: String },

    condition: {
        type: String,
        enum: ["Brand New", "New with Tags", "Used - Like New", "Used - Good"],
        required: true,
    },

    stock: { type: Number, default: 0 },

    images: [
        {
            url: { type: String, required: true },
            public_id: { type: String, required: true },
        },
    ],

    // Index of the featured/hero image within the images array. Defaults to 0.
    featuredImageIndex: { type: Number, default: 0 },

    isActive: { type: Boolean, default: true },

    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
    },

    createdAt: { type: Date, default: Date.now },
});

ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ brand: 1 });
ProductSchema.index({ team: 1 });

export default mongoose.models.Product ||
    mongoose.model<IProduct>("Product", ProductSchema);