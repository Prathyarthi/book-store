import { getProductById } from "@/lib/actions/product.actions";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { id: string } }) => {
    try {
        const product = await getProductById(params.id);
        return NextResponse.json(product, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to retrieve product" }, { status: 500 });
    }
}
