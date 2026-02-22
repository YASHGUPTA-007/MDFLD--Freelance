// models/Order.ts

import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItem {
    product: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
}

export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    items: IOrderItem[];
    totalAmount: number;
    paymentStatus: "pending" | "paid" | "failed";
    orderStatus: "processing" | "shipped" | "delivered" | "cancelled";
    shippingAddress: {
        name: string;
        address: string;
        city: string;
        postalCode: string;
        country: string;
    };
    stripePaymentIntentId: string;
    createdAt: Date;
}

const OrderSchema = new Schema<IOrder>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },

    items: [
        {
            product: { type: Schema.Types.ObjectId, ref: "Product" },
            quantity: Number,
            price: Number,
        },
    ],

    totalAmount: { type: Number, required: true },

    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
    },

    orderStatus: {
        type: String,
        enum: ["processing", "shipped", "delivered", "cancelled"],
        default: "processing",
    },

    shippingAddress: {
        name: String,
        address: String,
        city: String,
        postalCode: String,
        country: String,
    },

    stripePaymentIntentId: { type: String },

    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Order ||
    mongoose.model<IOrder>("Order", OrderSchema);