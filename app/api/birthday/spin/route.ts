


// import { prisma } from "@/lib/prisma";

// export async function POST(req: Request) {

//   const { token } = await req.json();

//   const record = await prisma.birthdayrecord.findUnique({
//     where: { spinToken: token }
//   });

//   if (!record || record.spinCompleted) {
//     return Response.json({ error: "Invalid or already used token" });
//   }

//   const prizes = ["Gift Card", "Extra Leave", "Chocolate Box", "Coffee Mug"];

//   const prize = prizes[Math.floor(Math.random() * prizes.length)];

//   await prisma.birthdayrecord.update({
//     where: { id: record.id },
//     data: {
//       spinCompleted: true
//     }
//   });

//   return Response.json({ prize });
// }



import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();

    if (!token) {
      return Response.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    // Find birthday record
    const record = await prisma.birthdayrecord.findUnique({
      where: {
        spinToken: token,
      },
    });

    if (!record) {
      return Response.json(
        { error: "Invalid token" },
        { status: 404 }
      );
    }

    if (record.spinCompleted) {
      return Response.json(
        { error: "This wheel has already been used." },
        { status: 400 }
      );
    }

    // Get available gifts
    const gifts = await prisma.gift.findMany({
      where: {
        available: true,
        quantity: {
          gt: 0,
        },
      },
    });

    if (gifts.length === 0) {
      return Response.json(
        { error: "No gifts available." },
        { status: 400 }
      );
    }

    // Pick random gift
    const selectedGift =
      gifts[Math.floor(Math.random() * gifts.length)];

    // Update birthday record
    await prisma.birthdayrecord.update({
      where: {
        id: record.id,
      },
      data: {
        spinCompleted: true,
        giftReceivedId: selectedGift.id,
        giftReceivedAt: new Date(),
      },
    });

    // Reduce quantity
    const newQuantity = selectedGift.quantity - 1;

    await prisma.gift.update({
      where: {
        id: selectedGift.id,
      },
      data: {
        quantity: newQuantity,
        available: newQuantity > 0,
      },
    });

    return Response.json({
      success: true,
      gift: {
        id: selectedGift.id,
        name: selectedGift.name,
      },
    });
  } catch (error) {
    console.error("Spin Error:", error);

    return Response.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}