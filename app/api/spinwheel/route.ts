import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { logActivity } from '@/lib/logger';
import { ActivityAction, ActivityModule } from '@prisma/client';

const PRIZES = [
  'Planter',
  'Scented Candles',
  'Fidget Toys',
  'Vase',
  'Table Lamp',
  'Photo Frame',
];

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json();
//     const { id } = body;

//     console.log(`[SPINWHEEL API] Received request with id: ${id}`);

//     if (!id) {
//       console.log(`[SPINWHEEL API] ❌ No ID provided`);
//       return NextResponse.json(
//         { error: 'Birthday record ID is required' },
//         { status: 400 }
//       );
//     }

//     const recordId = parseInt(String(id), 10);
    
//     console.log(`[SPINWHEEL API] Parsed recordId: ${recordId}, isNaN: ${isNaN(recordId)}`);

//     if (isNaN(recordId)) {
//       console.log(`[SPINWHEEL API] ❌ Invalid ID format`);
//       return NextResponse.json(
//         { error: 'Invalid birthday record ID format' },
//         { status: 400 }
//       );
//     }

//     console.log(`[SPINWHEEL API] Searching for birthdayRecord with id: ${recordId}`);

//     const birthdayRecord = await prisma.birthdayRecord.findUnique({
//       where: { id: recordId },
//       include: {
//         employee: true,
//         giftReceived: true,
//       },
//     });

//     console.log(`[SPINWHEEL API] Birthday record found:`, birthdayRecord);

//     if (!birthdayRecord) {
//       console.log(`[SPINWHEEL API] ❌ Birthday record not found with ID: ${recordId}`);
//       return NextResponse.json(
//         { error: 'Birthday record not found' },
//         { status: 404 }
//       );
//     }

//     // if (birthdayRecord.spinCompleted) {
//     //   console.log(`[SPINWHEEL API] ❌ User already spun the wheel`);
//     //   return NextResponse.json(
//     //     { error: 'You have already spun the wheel' },
//     //     { status: 403 }
//     //   );
//     // }

//     // Select a random prize from the available prizes
//     const randomPrize =
//       PRIZES[Math.floor(Math.random() * PRIZES.length)];

//     console.log(`[SPINWHEEL API] ✅ Selected prize: ${randomPrize}`);

//     return NextResponse.json({
//       id: birthdayRecord.id,
//       employee: birthdayRecord.employee.name,
//       prize: randomPrize,
//     });
//   } catch (error) {
//     console.error('[SPINWHEEL API] ❌ Error in spinwheel API:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const recordId = parseInt(String(id), 10);
    if (isNaN(recordId))
      return NextResponse.json({ error: 'Invalid ID' }, { status: 400 });

    const birthdayrecord = await prisma.birthdayrecord.findUnique({
      where: { id: recordId },
      include: { employee: true, gift: true },
    });
    if (!birthdayrecord)
      return NextResponse.json({ error: 'Birthday record not found' }, { status: 404 });

    if (birthdayrecord.spinCompleted) {
      return NextResponse.json(
        { alreadySpun: true, prize: birthdayrecord.gift?.name || null },
        { status: 200 }
      );
    }

    // Fetch available gifts
    const availableGifts = await prisma.gift.findMany({
      where: { available: true, quantity: { gt: 0 } },
    });

    if (availableGifts.length === 0)
      return NextResponse.json({ error: 'No gifts available' }, { status: 400 });

    // Pick random gift
    const randomIndex = Math.floor(Math.random() * availableGifts.length);
    const selectedGift = availableGifts[randomIndex];

    // Decrement quantity
    // await prisma.gift.update({
    //   where: { id: selectedGift.id },
    //   data: { quantity: selectedGift.quantity - 1 },
    // });

    const remaining = selectedGift.quantity - 1;

await prisma.gift.update({
  where: { id: selectedGift.id },
  data: {
    quantity: remaining,
    available: remaining > 0,
  },
});

    // Optionally mark spin as completed
    await prisma.birthdayrecord.update({
      where: { id: recordId },
      data: { spinCompleted: true, giftReceivedId: selectedGift.id },
    });

    // await logActivity({
    //   actorId: birthdayrecord.employee.id,
    //   actorName: birthdayrecord.employee.name,
    //   action: "SPIN_WHEEL_START",
    //   details: `Employee ${birthdayrecord.employee.name} (${birthdayrecord.employee.email}) spun the wheel and won prize: ${selectedGift.name}`,
    // });
    await logActivity({
  userId: birthdayrecord.employee.id.toString(),
  userName: birthdayrecord.employee.name,
  userEmail: birthdayrecord.employee.email,

  action: ActivityAction.SPIN,
  module: ActivityModule.BIRTHDAYS,

  description: `${birthdayrecord.employee.name} spun the birthday wheel and won "${selectedGift.name}".`,
});


    return NextResponse.json({
      id: birthdayrecord.id,
      employee: birthdayrecord.employee.name,
      prize: selectedGift.name,
    });
  } catch (err) {
    console.error('[SPINWHEEL API] Error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
