import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function proxy(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  // 1. Redirect root to dashboard
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 2. Bypass auth if configured
  if (process.env.NEXT_PUBLIC_BYPASS_AUTH === "true") {
    return NextResponse.next();
  }

    // Prevent logged-in users from visiting login
  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }
  // 3. Define protected routes
  const protectedRoutes = [
    "/dashboard",
    "/employees",
    "/gifts",
    "/settings",
    "/today-birthday",
    "/test-birthday"
  ];

  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isProtectedRoute) {
    // ❌ Not logged in -> Redirect to login
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // ❌ Not ADMIN -> Redirect to login (or access denied page)
    if (token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    //  "/login",
    "/dashboard/:path*",
    "/employees/:path*",
    "/gifts/:path*",
    "/settings/:path*",
    "/today-birthday/:path*",
    "/test-birthday/:path*",
  ],
};
