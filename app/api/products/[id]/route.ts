import { getProductById } from "@/lib/actions/product.actions";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const { id } = await params;
        const product = await getProductById(id);
        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : "Failed to retrieve product"
        }, { status: 500 });
    }
}