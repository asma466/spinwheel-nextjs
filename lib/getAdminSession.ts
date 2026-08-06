import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth/next";

import { NextRequest, NextResponse } from "next/server";

// export async function getAdminSession(req: NextRequest) {
export async function getAdminSession() {

    // ✅ DEV ONLY: auto-admin for localhost
//   if (process.env.NODE_ENV === "development") {
//     return {
//       user: {
//         id: "2",
//         email: "admin@dev.local",
//         role: "ADMIN",
//         name: "Dev Admin",
//         password: "dev12345"
//       },
//     };
//   }
  // App Router API handler way
  // const session = await getServerSession( {req, ...authOptions});
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }

  return session;
}