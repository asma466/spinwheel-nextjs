import { prisma } from "@/lib/prisma";

export async function getRandomAvailableGift() {
    const gifts = await prisma.gift.findMany({
        where: {
            quantity: { gt: 0 },
            available: true,
        },
    });

    if (gifts.length === 0) return null;

    const randomGift = gifts[Math.floor(Math.random() * gifts.length)];

    return randomGift;
}

export async function assignGiftToUser(recordId: number) {
    const gift = await getRandomAvailableGift();

    if (!gift) {
        throw new Error("No gifts available");
    }

    // Reduce quantity
    await prisma.gift.update({
        where: { id: gift.id },
        data: {
            quantity: {
                decrement: 1,
            },
        },
    });

    // Save gift in BirthdayRecord
    await prisma.birthdayrecord.update({
        where: { id: recordId },
        data: {
            giftReceivedId: gift.id,
            giftReceivedAt: new Date(),
            spinCompleted: true,
        },
    });

    return gift;
}