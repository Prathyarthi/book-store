import { createProduct } from "@/lib/actions/product.actions";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const { title, author, price, imageUrl } = await req.json();

        if (!title || !author || !price || !imageUrl) {
            return NextResponse.json(
                { error: "All fields (title, author, price, imageUrl) are required" },
                { status: 400 }
            );
        }

        const product = await createProduct(title, author, price, imageUrl);

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Failed to create product" },
            { status: 500 }
        );
    }
}
