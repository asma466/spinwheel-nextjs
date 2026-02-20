import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendBirthdayGreetingEmail } from '@/lib/email';

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
    console.log(`[API LOG] Received birthday email request for employee ID: ${employeeId}`);
    
    const year = new Date().getFullYear();

    // Fetch employee to get name and email
    const employee = await prisma.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      console.error(`[API LOG] ❌ Employee not found with ID: ${employeeId}`);
      return NextResponse.json(
        { message: 'Employee not found' },
        { status: 404 }
      );
    }

    console.log(`[API LOG] Found employee: ${employee.name} (${employee.email})`);

    // Create or update birthday record
    const record = await prisma.birthdayRecord.upsert({
      where: { employeeId_year: { employeeId, year } },
      update: { emailSent: true },
      create: { employeeId, year, emailSent: true },
    });

    console.log(`[API LOG] Birthday record created/updated with ID: ${record.id}`);
    console.log(`[API LOG] Calling sendBirthdayGreetingEmail with recordId: ${record.id}`);

    // Send birthday greeting email with the record ID
    await sendBirthdayGreetingEmail(employee.name, employee.email, record.id);

    console.log(`[API LOG] Email function completed`);
    console.log(`[API LOG] ✅ Birthday record updated for employee ${employee.name}`);

    return NextResponse.json(record);
  } catch (err) {
    console.error(`[API LOG] ❌ Error in birthday email endpoint:`, err);
    return NextResponse.json(
      { message: 'Failed to send birthday email' },
      { status: 500 }
    );
  }
}