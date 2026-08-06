import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { authOptions } from "../auth/[...nextauth]/options";
import { logActivity } from "@/lib/logger";
import { ActivityAction, ActivityModule } from "@prisma/client";
export const runtime = "nodejs";
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
      return NextResponse.json(
        { error: "All fields required" },
        { status: 400 }
      );
    }

    // 🔥 Use ID instead of email
    const user = await prisma.employee.findUnique({
      where: { id: Number(session.user.id) },
    });

    if (!user || !user.password) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // ✅ Verify current password
    const isValid = await bcrypt.compare(currentPassword, user.password);

    if (!isValid) {
      return NextResponse.json(
        { error: "Incorrect current password" },
        { status: 400 }
      );
    }

    // ✅ Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // 🔥 Update using ID
    await prisma.employee.update({
      where: { id: Number(session.user.id) },
      data: { password: hashedPassword },
    });

    // await logActivity({
    //   actorId: Number(session.user.id),
    //   actorName: session.user.name || session.user.email,
    //   action: "CHANGE_PASSWORD",
    //   details: `Admin changed password successfully`,
    // });
     // ✅ Activity Log
    await logActivity({
      userId: session.user.id?.toString(),
      userName: session.user.name ?? "Unknown User",
      userEmail: session.user.email ?? "Unknown",
      action: ActivityAction.UPDATE,
      module: ActivityModule.EMPLOYEES,
      description: "Changed account password",
    });

    return NextResponse.json({
      message: "Password updated successfully",
    });

  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}