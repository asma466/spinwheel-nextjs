import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
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
      return NextResponse.json(
        { error: 'Birthday record not found' },
        { status: 404 }
      );
    }

    // Update birthday record to mark spin as completed
    const updatedRecord = await prisma.birthdayRecord.update({
      where: { id: parseInt(id) },
      data: {
        spinCompleted: true,
        giftReceivedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Spin completed successfully',
      record: updatedRecord,
    });
  } catch (error) {
    console.error('Error in finish API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
