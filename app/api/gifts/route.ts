import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import { logActivity } from '@/lib/logger';
import { ActivityAction, ActivityModule } from '@prisma/client';

// GET all gifts
export const runtime = "nodejs";
export async function GET(request: NextRequest) {
  try {
    const gifts = await prisma.gift.findMany({
      orderBy: {
        name: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      data: gifts,
    });
  } catch (error) {
    console.error('Error fetching gifts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gifts' },
      { status: 500 }
    );
  }
}

// POST create new gift
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, quantity, available } = body;

    if (!name || quantity === undefined ) {
      return NextResponse.json(
        { error: 'Name and quantity are required' },
        { status: 400 }
      );
    }

    const gift = await prisma.gift.create({
      data: {
        name,
        // quantity: parseInt(quantity),
         quantity: Number(quantity),
        available: available ?? true,
      },
    });

 const session = await getServerSession(authOptions);

await logActivity({
  userId: session?.user?.id?.toString(),
  userName: session?.user?.name ?? "System",
  userEmail: session?.user?.email ?? "system@wheelspin.com",

  action: ActivityAction.CREATE,
  module: ActivityModule.GIFTS,

  description: `Created gift "${gift.name}"`,
});
    return NextResponse.json(
      {
        success: true,
        message: 'Gift created successfully',
        data: gift,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating gift:', error);
    return NextResponse.json(
      { error: 'Failed to create gift' },
      { status: 500 }
    );
  }
}
