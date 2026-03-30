import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });

  const isDashboard = req.nextUrl.pathname.startsWith("/dashboard");

  // ❌ Not logged in
  if (!token && isDashboard) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // ❌ Not ADMIN
  if (isDashboard && token?.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};