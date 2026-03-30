import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { authOptions } from "../auth/[...nextauth]/options";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // ❌ Not logged in
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ❌ Only admin allowed
    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    // 🔍 Find user
    const user = await prisma.employee.findUnique({
      where: { email: session.user.email },
    });

    if (!user || !user.password) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    //  Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      return NextResponse.json({ error: "Incorrect current password" }, { status: 400 });
    }

    //  Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.employee.update({
      where: { email: session.user.email },
      data: { password: hashedPassword },
    });

    return NextResponse.json({ message: "Password updated successfully" });

  } catch (error) {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}