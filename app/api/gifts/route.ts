import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET all gifts
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
        quantity: parseInt(quantity),
        available: available ?? true,
      },
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
