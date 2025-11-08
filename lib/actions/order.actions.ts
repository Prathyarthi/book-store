import { getServerSession } from "next-auth";
import Razorpay from "razorpay";
import { authOptions } from "../auth";
import { connectToDatabase } from "@/db";
import Order from "@/models/Order";
import Product from "@/models/Product";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID as string,
    key_secret: process.env.RAZORPAY_KEY_SECRET as string
})

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

        const options = {
            amount: Math.round(product.price * 100),
            currency: "INR",
            receipt: `receipt_order_${productId}`,
            notes: {
                productId: productId.toString(),
            }
        }

        const order = await razorpay.orders.create(options);

        const newOrder = await Order.create({
            userId: session.user.id,
            productId: productId,
            quantity: quantity,
            razorpayOrderId: order.id,
            amount: Math.round(product.price * 100),
            status: 'pending',
        });

        return {
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            dbOrderId: newOrder._id,
        };
    } catch (error) {
        throw new Error("Failed to create order");
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
            select: "title description imageUrl price",
            options: {strictPopulate: false}
        }).sort({ createdAt: -1 }).lean();

        return orders;
    } catch (error) {
        throw new Error("Failed to retrieve orders");
    }
}
