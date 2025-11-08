'use server'

import { connectToDatabase } from "@/db"
import Product from "@/models/Product";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export const listAllProducts = async () => { 
    try {
        await connectToDatabase();

        const products = await Product.find({}).lean();

        if (!products || products.length === 0) {
            throw new Error("No products found");
        }

        return products;
    } catch (error) {
        console.error("Error listing products:", error);
        throw new Error("Failed to list products");
    }
}

export const createProduct = async (title: string, author: string, price: number, imageUrl: string) => { 
    try {
        const session = await getServerSession(authOptions);

        if(!session || session.user.role !== 'admin') {
            throw new Error("Unauthorized: Admin access required");
        }
        
        if (!title || !author || !price || !imageUrl) {
            throw new Error("All product fields are required");
        }

        await connectToDatabase();

        const product = await Product.create({
            title,
            author,
            price,
            imageUrl
        });

        return product;
    } catch (error) {
        console.error("Error creating product:", error);
        throw new Error("Failed to create product");
    }
}

export const deleteProduct = async (productId: string) => { 
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            throw new Error("Unauthorized: Admin access required");
        }

        await connectToDatabase();

        const product = await Product.findByIdAndDelete(productId);

        if (!product) {
            throw new Error("Product not found");
        }

        return product;
    } catch (error) {
        console.error("Error deleting product:", error);
        throw new Error("Failed to delete product");
    }
}

export const getProductById = async (productId: string) => { 
    try {
        await connectToDatabase();

        const product = await Product.findById(productId).lean();

        if (!product) {
            throw new Error("Product not found");
        }

        return product;
    } catch (error) {
        console.error("Error getting product by ID:", error);
        throw new Error("Failed to get product");
    }
}
