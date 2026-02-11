import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { employeeId } = await req.json();
  const year = new Date().getFullYear();

  const lastYearGift = await prisma.spinHistory.findFirst({
    where: { employeeId, year: year - 1 }
  });

  const gifts = await prisma.gift.findMany({
    where: {
      available: true,
      NOT: { id: lastYearGift?.giftId }
    }
  });

  const gift = gifts[Math.floor(Math.random() * gifts.length)];

  const spin = await prisma.spinHistory.create({
    data: {
      employeeId,
      giftId: gift.id,
      year
    }
  });

  return NextResponse.json({ gift });
}
