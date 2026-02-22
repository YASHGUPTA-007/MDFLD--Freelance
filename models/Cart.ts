// models/Cart.ts

import mongoose, { Schema, Document } from "mongoose";

export interface ICartItem {
    product: mongoose.Types.ObjectId;
    quantity: number;
}

export interface ICart extends Document {
    user: mongoose.Types.ObjectId;
    items: ICartItem[];
    updatedAt: Date;
}

const CartSchema = new Schema<ICart>({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
    },

    items: [
        {
            product: { type: Schema.Types.ObjectId, ref: "Product" },
            quantity: { type: Number, default: 1 },
        },
    ],

    updatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Cart ||
    mongoose.model<ICart>("Cart", CartSchema);