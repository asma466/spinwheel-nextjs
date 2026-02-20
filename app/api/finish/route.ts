import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendwinMail } from '@/lib/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, prize } = body;

    console.log(`[FINISH API] Received spin completion request with id: ${id}, prize: ${prize}`);

    if (!id) {
      console.error(`[FINISH API] ❌ No birthday record ID provided`);
      return NextResponse.json(
        { error: 'Birthday record ID is required' },
        { status: 400 }
      );
    }

    const birthdayRecord = await prisma.birthdayRecord.findUnique({
      where: { id: parseInt(id) },
      include: {
        employee: true,
        giftReceived: true,
      },
    });

    if (!birthdayRecord) {
      console.error(`[FINISH API] ❌ Birthday record not found with ID: ${id}`);
      return NextResponse.json(
        { error: 'Birthday record not found' },
        { status: 404 }
      );
    }

    if (birthdayRecord.spinCompleted) {
      console.error(`[FINISH API] ❌ Spin already completed for record ${id}`);
      return NextResponse.json(
        { error: 'Spin already completed' },
        { status: 400 }
      );
    }

    // Find the gift by name
    let giftId: number | null = null;
    if (prize) {
      const gift = await prisma.gift.findFirst({
        where: {
          name: prize,
        },
      });

      if (gift) {
        giftId = gift.id;
        console.log(`[FINISH API] Found gift: ${gift.name} (ID: ${gift.id})`);
      } else {
        console.warn(`[FINISH API] ⚠️ Gift not found in database: ${prize}`);
      }
    }

    // Update birthday record to mark spin as completed and store gift
    const updatedRecord = await prisma.birthdayRecord.update({
      where: { id: parseInt(id) },
      data: {
        spinCompleted: true,
        giftReceivedAt: new Date(),
        // ...(giftId ? { giftReceivedId: giftId } : {}),
         giftReceivedId: giftId ?? undefined,
      },
      include: {
        employee: true,
        giftReceived: true,
      },
    });

    console.log(`[FINISH API] ✅ Updated birthday record:`, updatedRecord);

    // Send winning email
    if (prize && birthdayRecord.employee) {
      console.log(`[FINISH API] Sending winning email to ${birthdayRecord.employee.name}`);
      await sendwinMail(
        birthdayRecord.employee.name,
        birthdayRecord.employee.email,
        prize
      );
    }

    console.log(`[FINISH API] ✅ Spin completed for employee: ${birthdayRecord.employee.name}, Gift: ${prize}`);

    return NextResponse.json({
      success: true,
      message: 'Spin completed successfully',
      record: updatedRecord,
    });
  } catch (error) {
    console.error('[FINISH API] ❌ Error in finish API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
