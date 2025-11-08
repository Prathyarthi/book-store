import { NextRequest } from "next/server";
import crypto from "crypto";
import { connectToDatabase } from "@/db";
import Order from "@/models/Order";

export async function POST(req: NextRequest) {
    try {
        const body = await req.text();
        req.headers.get("x-razorpay-signature");

        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET as string)
            .update(body)
            .digest('hex');
        
        if(expectedSignature !== req.headers.get("x-razorpay-signature")) {
            return new Response("Invalid signature", { status: 400 });
        }

        const event = JSON.parse(body);

        await connectToDatabase();

        switch (event.event) {
            case 'payment.captured':
                const paymentData = event.payload.payment.entity;

                const order = await Order.findOneAndUpdate(
                    { razorpayOrderId: paymentData.order_id },
                    { status: 'completed' }
                ).populate([
                    { path: "productId", select: "title" },
                    { path: "userId", select: "email" }
                ]);

                if (order) { 
                    return new Response("Webhook processed", { status: 200 });
                }

                break;
            case 'payment.failed':
                const failedPaymentData = event.payload.payment.entity;

                const failedOrder = await Order.findOneAndUpdate(
                    { razorpayOrderId: failedPaymentData.order_id },
                    { status: 'failed' }
                );

                if (failedOrder) { 
                    return new Response("Webhook processed", { status: 200 });
                }
                break;
            default:
                console.log(`Unhandled event type: ${event.event}`);
        }
    } catch (error) {
        console.error("Error processing webhook:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}