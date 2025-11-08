'use server'

import { connectToDatabase } from "@/db";
import User from "@/models/User";

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