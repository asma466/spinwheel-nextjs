import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { logActivity } from "@/lib/logger";
import { ActivityAction, ActivityModule } from "@prisma/client";

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }

  await logActivity({
    userId: session.user.id,
    userName: session.user.name ?? "Unknown User",
    userEmail: session.user.email ?? "unknown@wheelspin.com",
    action: ActivityAction.LOGOUT,
    module: ActivityModule.AUTH,
    description: `${session.user.name} logged out successfully.`,
  });

  return NextResponse.json({ success: true });
}