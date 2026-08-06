import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendwinMail } from '@/lib/email';
import { logActivity } from '@/lib/logger';
import { ActivityAction, ActivityModule } from '@prisma/client';

export const runtime = "nodejs";
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

    const recordId = parseInt(id); // Parse id once

    const birthdayRecord = await prisma.birthdayrecord.findUnique({
      where: { id: recordId },
      include: {
        employee: true,
        // giftReceived: true,
      },
    });

    if (!birthdayRecord) {
      console.error(`[FINISH API] ❌ Birthday record not found with ID: ${id}`);
      return NextResponse.json(
        { error: 'Birthday record not found' },
        { status: 404 }
      );
    }


    // Wait, since /api/spinwheel already updated this, we don't need to mark spinCompleted here.
    // However, if giftReceivedId is missing, we can try to fix it, but let's just use it to send email.
    const updatedRecord = await prisma.birthdayrecord.update({
      where: { id: parseInt(id) },
      data: {
        giftReceivedAt: new Date(),
      },
      include: {
        employee: true,
        // giftReceived: true,
      },
    });

    console.log(`[FINISH API] ✅ Updated birthday record:`, updatedRecord);

    // await logActivity({
    //   actorId: birthdayRecord.employee.id,
    //   actorName: birthdayRecord.employee.name,
    //   action: "SPIN_WHEEL_COMPLETE",
    //   details: `Employee ${birthdayRecord.employee.name} (${birthdayRecord.employee.email}) completed the spin and successfully claimed the prize: ${prize}`,
    // });

    await logActivity({
  userId: birthdayRecord.employee.id.toString(),
  userName: birthdayRecord.employee.name,
  userEmail: birthdayRecord.employee.email,

  action: ActivityAction.SPIN,
  module: ActivityModule.BIRTHDAYS,

  description: `${birthdayRecord.employee.name} completed the birthday wheel spin and claimed "${prize}".`,
});

    // Send winning email
    if (prize && birthdayRecord.employee) {
      console.log(`[FINISH API] Sending winning email to ${birthdayRecord.employee.name}`);
      await sendwinMail(
        birthdayRecord.employee.name,
        birthdayRecord.employee.email,
        prize
      );

      // await logActivity({
      //   actorId: birthdayRecord.employee.id,
      //   actorName: birthdayRecord.employee.name,
      //   action: "SEND_WIN_EMAIL",
      //   details: `Sent prize confirmation email to employee ${birthdayRecord.employee.name} (${birthdayRecord.employee.email}) for prize: ${prize}`,
      // });

      await logActivity({
  userId: birthdayRecord.employee.id.toString(),
  userName: birthdayRecord.employee.name,
  userEmail: birthdayRecord.employee.email,

  action: ActivityAction.EMAIL,
  module: ActivityModule.BIRTHDAYS,

  description: `Sent winner email to ${birthdayRecord.employee.name} for prize "${prize}".`,
});
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
