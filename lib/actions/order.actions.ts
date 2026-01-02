'use server'

import { getServerSession } from "next-auth";
import Razorpay from "razorpay";
import { authOptions } from "../auth";
import { connectToDatabase } from "@/db";
import Order from "@/models/Order";
import Product from "@/models/Product";

// const razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID as string,
//     key_secret: process.env.RAZORPAY_KEY_SECRET as string
// })

export const createOrder = async (productId: string, quantity: number) => {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            throw new Error("Unauthorized");
        }

        await connectToDatabase();

        const product = await Product.findById(productId);

        if (!product) {
            throw new Error("Product not found");
        }

        // const options = {
        //     amount: Math.round(product.price * 100),
        //     currency: "INR",
        //     receipt: `receipt_order_${productId}`,
        //     notes: {
        //         productId: productId.toString(),
        //     }
        // }

        // const order = await razorpay.orders.create(options);

        const newOrder = await Order.create({
            userId: session.user.id,
            productId: productId,
            quantity: quantity,
            razorpayOrderId: `order_${Date.now()}`, // order.id when using Razorpay
            amount: Math.round(product.price * 100),
            status: 'pending',
        });

        return {
            orderId: String(newOrder._id), // Convert ObjectId to string
            amount: Math.round(product.price * 100),
            currency: "INR",
            dbOrderId: String(newOrder._id), // Convert ObjectId to string
        };
    } catch (error) {
        console.error("Error creating order:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to create order");
    }
}

export const getOrdersForUser = async () => {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            throw new Error("Unauthorized");
        }

        await connectToDatabase();

        const orders = await Order.find({ userId: session.user.id }).populate({
            path: "productId",
            select: "title author imageUrl price",
            options: { strictPopulate: false }
        }).sort({ createdAt: -1 }).lean();

        return orders;
    } catch (error) {
        throw new Error("Failed to retrieve orders");
    }
}

export const getAllOrders = async () => {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            throw new Error("Unauthorized: Admin access required");
        }

        await connectToDatabase();

        const orders = await Order.find({})
            .populate({
                path: "productId",
                select: "title author imageUrl price",
                options: { strictPopulate: false }
            })
            .populate({
                path: "userId",
                select: "email",
                options: { strictPopulate: false }
            })
            .sort({ createdAt: -1 })
            .lean();

        return JSON.parse(JSON.stringify(orders));
    } catch (error) {
        console.error("Error fetching orders:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to fetch orders");
    }
}
