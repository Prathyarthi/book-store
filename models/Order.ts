import mongoose, { model, models, mongo, Schema } from "mongoose";

interface PopulatedUser {
    _id: string;
    email: string;
    role: 'user' | 'admin';
}

interface PopulatedProduct {
    _id: string;
    title: string;
    description: string;
    imageUrl: string;
    price: number;
}

interface IOrder {
    _id?: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId | PopulatedUser;
    productId: mongoose.Types.ObjectId | PopulatedProduct;
    price: number;
    quantity: number;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
}

const orderSchema = new Schema<IOrder>({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        default: 1, 
    },
    razorpayOrderId: {
        type: String,
        required: true,
    },
    razorpayPaymentId: {
        type: String,
    },
    amount: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'pending',
    }
}, { timestamps: true });

const Order = models?.Order || model<IOrder>('Order', orderSchema);

export default Order;