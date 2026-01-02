import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        return NextResponse.next();
    },
    {
        callbacks: {
            authorized: ({ token, req }) => {
                const { pathname } = req.nextUrl;

                if (pathname.startsWith('/api/auth') ||
                    pathname === '/login' ||
                    pathname === '/register' ||
                    pathname.startsWith('/auth/signin') ||
                    pathname.startsWith('/auth/signup')) {
                    return true;
                }

                // Public routes
                if (pathname === '/' ||
                    pathname.startsWith('/api/products') ||
                    pathname.
                        startsWith('/products/')) {
                    return true;
                }

                // Admin routes
                if (pathname.startsWith('/admin')) {
                    return token?.role === 'admin';
                }

                // All other routes require authentication
                return !!token;
            }
        },
    },
)

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|public/).*)"
    ]
}