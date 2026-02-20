import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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
