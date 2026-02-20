import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET single gift by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const gift = await prisma.gift.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!gift) {
      return NextResponse.json(
        { error: 'Gift not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: gift,
    });
  } catch (error) {
    console.error('Error fetching gift:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gift' },
      { status: 500 }
    );
  }
}

// PUT update gift
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, quantity, available } = body;

    const gift = await prisma.gift.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!gift) {
      return NextResponse.json(
        { error: 'Gift not found' },
        { status: 404 }
      );
    }

    // Safely coerce and validate quantity
    let quantityValue: number | undefined = undefined;
    if (quantity !== undefined && quantity !== null) {
      const n = Number(quantity);
      if (Number.isNaN(n)) {
        return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
      }
      quantityValue = Math.floor(n);
    }

    const updatedGift = await prisma.gift.update({
      where: { id: parseInt(id, 10) },
      data: {
        name: name ?? gift.name,
        quantity: quantityValue !== undefined ? quantityValue : gift.quantity,
        available: available !== undefined ? Boolean(available) : gift.available,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Gift updated successfully',
      data: updatedGift,
    });
  } catch (error) {
    console.error('Error updating gift:', error);
    return NextResponse.json(
      { error: 'Failed to update gift' },
      { status: 500 }
    );
  }
}

// DELETE gift
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const gift = await prisma.gift.findUnique({
      where: { id: parseInt(id) },
    });

    if (!gift) {
      return NextResponse.json(
        { error: 'Gift not found' },
        { status: 404 }
      );
    }

    await prisma.gift.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      success: true,
      message: 'Gift deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting gift:', error);
    return NextResponse.json(
      { error: 'Failed to delete gift' },
      { status: 500 }
    );
  }
}
