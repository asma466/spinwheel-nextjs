import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendMail } from '@/lib/email';
export const runtime = "nodejs";
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email } = body;

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Check if employee exists
    let employee = await prisma.employee.findUnique({
      where: { email },
    });

    // If employee doesn't exist, create one
    if (!employee) {
      employee = await prisma.employee.create({
        data: {
          name,
          email,
          dob: new Date(),
          createdAt: new Date(),
          department: 'Unknown',
        },
      });
    }

    // Create birthday record for current year
    const currentYear = new Date().getFullYear();
    // const tenstringid = generateRandomString();

    const birthdayRecord = await prisma.birthdayrecord.create({
      data: {
        year: currentYear,
        employeeId: employee.id,
        emailSent: false,
        spinCompleted: false,
         updatedAt: new Date(), // ✅ FIX
  
      },
    });

    // Send birthday email
    await sendMail(name, email, `${birthdayRecord.id}`);

    // Update to mark email as sent
    await prisma.birthdayrecord.update({
      where: { id: birthdayRecord.id },
      data: { emailSent: true },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Birthday record created and email sent successfully',
        recordId: birthdayRecord.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in birthday API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
