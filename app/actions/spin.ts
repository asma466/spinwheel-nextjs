// /app/actions/spin.ts
"use server";

import { prisma } from "@/lib/prisma";

export async function spinWheel(recordId: number) {
    if (!recordId) throw new Error("Missing recordId");

    const record = await prisma.birthdayRecord.findUnique({
        where: { id: recordId },
    });

    if (!record) throw new Error("Record not found");

    if (record.spinCompleted) {
        throw new Error("Already spun");
    }

    const availableGifts = await prisma.gift.findMany({
        where: {
            available: true,
            quantity: { gt: 0 },
        },
    });

    if (availableGifts.length === 0) {
        throw new Error("No gifts available");
    }

    const randomGift =
        availableGifts[Math.floor(Math.random() * availableGifts.length)];

    // ✅ transaction (VERY IMPORTANT)
    await prisma.$transaction([
        prisma.birthdayRecord.update({
            where: { id: recordId },
            data: {
                spinCompleted: true,
                giftReceivedId: randomGift.id,
                giftReceivedAt: new Date(),
            },
        }),
        prisma.gift.update({
            where: { id: randomGift.id },
            data: {
                quantity: randomGift.quantity - 1,
                available: randomGift.quantity - 1 > 0,
            },
        }),
    ]);

    return randomGift.name;
}