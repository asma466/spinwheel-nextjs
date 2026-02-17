import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const records = await prisma.birthdayRecord.findMany({
      include: {
        employee: true,
        giftReceived: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(records);
  } catch (err) {
    console.error('Error fetching birthday records:', err);
    return NextResponse.json(
      { message: 'Failed to fetch birthday records' },
      { status: 500 }
    );
  }
}

// API to send birthday email
export async function POST(req: Request) {
  try {
    const { employeeId } = await req.json();
    const year = new Date().getFullYear();

    // Create or update birthday record
    const record = await prisma.birthdayRecord.upsert({
      where: { employeeId_year: { employeeId, year } },
      update: { emailSent: true },
      create: { employeeId, year, emailSent: true },
    });

    // TODO: send actual email here (mocked)
    console.log(`Birthday email sent to employee ${employeeId}`);

    return NextResponse.json(record);
  } catch (err) {
    console.error('Error sending birthday email:', err);
    return NextResponse.json(
      { message: 'Failed to send birthday email' },
      { status: 500 }
    );
  }
}