import { connectToDatabase } from "@/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email", placeholder: "amogh@gmail.com" },
                password: { label: "Password", type: "password", placeholder: "Your Password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and Password are required");
                }

                try {
                    await connectToDatabase();

                    const user = await User.findOne({ email: credentials.email });

                    if (!user) {
                        throw new Error("Invalid email or password");
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

                    if (!isPasswordCorrect) {
                        throw new Error("Invalid email or password");
                    }

                    return user;
                } catch (error) {
                    console.log("Auth Error", error);
                    throw new Error("Invalid email or password");
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
                token.role = user.role
            }
            return token
        },
        async session({ session, token }) {
            session.user.id = token.id as string
            session.user.role = token.role as string

            return session
        }
    },
    pages: {
        signIn: '/auth/signin',
        error: '/auth/error',
    },
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
}