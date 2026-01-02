'use server'

import { connectToDatabase } from "@/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";

export const signup = async (email: string, password: string) => {
    try {
        if (!email || !password) {
            throw new Error("Email and Password are required");
        }

        await connectToDatabase();

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new Error("User already exists with this email");
        }

        const user = await User.create({
            email,
            password,
            role: 'user',
        });

        return {
            message: "User registered successfully",
            userId: user._id,
            email: user.email,
            role: user.role,
        }

    } catch (error) {
        console.error("Signup Error:", error);
        throw new Error("Internal Server Error");
    }
}

export const getAllUsers = async () => {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'admin') {
            throw new Error("Unauthorized: Admin access required");
        }

        await connectToDatabase();

        const users = await User.find({}).select('-password').sort({ createdAt: -1 }).lean();

        return JSON.parse(JSON.stringify(users));
    } catch (error) {
        console.error("Error fetching users:", error);
        throw new Error(error instanceof Error ? error.message : "Failed to fetch users");
    }
}