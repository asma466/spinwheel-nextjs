import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { assignGiftToUser } from "@/lib/gift";


export async function POST(req: Request) {
  const body = await req.json();
  const employeeId = body.employeeId || body.id; // Accept both employeeId and id

  if (!employeeId) {
    return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 });
  }

  const year = new Date().getFullYear();

  // Find last year's birthday record for this employee (if any)
  const lastYearRecord = await prisma.birthdayRecord.findFirst({
    where: { employeeId, year: year - 1 },
    select: { giftReceivedId: true },
  });

  const excludeId = lastYearRecord?.giftReceivedId ?? undefined;

  const gifts = await prisma.gift.findMany({
    where: {
      available: true,
      ...(excludeId ? { NOT: { id: excludeId } } : {}),
    },
  });

  if (!gifts || gifts.length === 0) {
    return NextResponse.json({ error: 'No available gifts' }, { status: 404 });
  }

  const gift = gifts[Math.floor(Math.random() * gifts.length)];

  return NextResponse.json({ gift });
}





export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const recordId = Number(searchParams.get("x"));

    if (!recordId) {
      return Response.json({ success: false, message: "Invalid token" });
    }

    // Check record
    const record = await prisma.birthdayRecord.findUnique({
      where: { id: recordId },
    });

    if (!record) {
      return Response.json({ success: false, message: "Record not found" });
    }

    if (record.spinCompleted) {
      return Response.json({
        success: true,
        message: "Already spun",
        giftId: record.giftReceivedId,
      });
    }

    // 🎁 Assign gift
    const gift = await assignGiftToUser(recordId);

    return Response.json({
      success: true,
      gift: gift.name,
    });

  } catch (error) {
    console.error("Spin Error:", error);
    return Response.json({ success: false, error: String(error) });
  }
}