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

    if (birthdayRecord.spinCompleted) {
      return NextResponse.json(
        { error: 'You have already spun the wheel' },
        { status: 403 }
      );
    }

    // Get a random prize from available gifts
    const availableGifts = await prisma.gift.findMany({
      where: { available: true },
    });

    if (availableGifts.length === 0) {
      return NextResponse.json(
        { error: 'No gifts available' },
        { status: 400 }
      );
    }

    const randomGift =
      availableGifts[Math.floor(Math.random() * availableGifts.length)];

    return NextResponse.json({
      id: birthdayRecord.id,
      employee: birthdayRecord.employee.name,
      prize: randomGift.name,
    });
  } catch (error) {
    console.error('Error in spinwheel API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
