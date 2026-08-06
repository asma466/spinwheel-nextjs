// import { NextResponse } from 'next/server';
// import { prisma } from '@/lib/prisma';
// import { sendBirthdayGreetingEmail } from '@/lib/email';
// import { logActivity } from '@/lib/logger';
// import { getAdminSession } from '@/lib/getAdminSession';
// import { ActivityAction, ActivityModule } from '@prisma/client';

// export const runtime = "nodejs";
// export async function GET() {
//   try {
//     const records = await prisma.birthdayrecord.findMany({
//       include: {
//         employee: true,
//         // giftReceived: true,
//         gift: true,
//       },
//       orderBy: {
//         createdAt: 'desc',
//       },
//     });

//     return NextResponse.json(records);
//   } catch (err) {
//     console.error('Error fetching birthday records:', err);
//     return NextResponse.json(
//       { message: 'Failed to fetch birthday records' },
//       { status: 500 }
//     );
//   }
// }

// // API to send birthday email
// export async function POST(req: Request) {
//    const session = await getAdminSession();
//   try {
//     const { employeeId } = await req.json();
//     console.log(`[API LOG] Received birthday email request for employee ID: ${employeeId}`);
    
//     const year = new Date().getFullYear();

//     // Fetch employee to get name and email
//     const employee = await prisma.employee.findUnique({
//       where: { id: employeeId },
//     });

//     if (!employee) {
//       console.error(`[API LOG] ❌ Employee not found with ID: ${employeeId}`);
//       return NextResponse.json(
//         { message: 'Employee not found' },
//         { status: 404 }
//       );
//     }

//     console.log(`[API LOG] Found employee: ${employee.name} (${employee.email})`);

//     // Create or update birthday record
//     const record = await prisma.birthdayrecord.upsert({
//       where: { employeeId_year: { employeeId, year } },
//       update: { emailSent: true },
//       create: { employeeId, year, emailSent: true },
//     });

//     console.log(`[API LOG] Birthday record created/updated with ID: ${record.id}`);
//     console.log(`[API LOG] Calling sendBirthdayGreetingEmail with recordId: ${record.id}`);

//     // Send birthday greeting email with the record ID
//     await sendBirthdayGreetingEmail(employee.name, employee.email, record.id);

//   await logActivity({
//   userId: session?.user.id,
//   userName: session?.user.name ?? "Unknown User",
//   userEmail: session?.user.email ?? "unknown@wheelspin.com",

//   action: ActivityAction.EMAIL,
//   module: ActivityModule.BIRTHDAYS,

//   description: `Manually sent birthday email to ${employee.name} (${employee.email}).`,
// });

//     console.log(`[API LOG] Email function completed`);
//     console.log(`[API LOG] ✅ Birthday record updated for employee ${employee.name}`);

//     return NextResponse.json(record);
//   } catch (err) {
//     console.error(`[API LOG] ❌ Error in birthday email endpoint:`, err);
//     return NextResponse.json(
//       { message: 'Failed to send birthday email' },
//       { status: 500 }
//     );
//   }
// }



import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendBirthdayGreetingEmail } from "@/lib/email";
import { logActivity } from "@/lib/logger";
import { getAdminSession } from "@/lib/getAdminSession";
import { ActivityAction, ActivityModule } from "@prisma/client";

export const runtime = "nodejs";

// ================= GET =================

export async function GET() {
  try {
    const records = await prisma.birthdayrecord.findMany({
      include: {
        employee: true,
        gift: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error("GET Birthday Records Error:", error);

    return NextResponse.json(
      { message: "Failed to fetch birthday records" },
      { status: 500 }
    );
  }
}

// ================= POST =================

export async function POST(req: Request) {
  const session = await getAdminSession();

  try {
    const { employeeId } = await req.json();

    console.log("Employee ID:", employeeId);

    const year = new Date().getFullYear();

    // Find employee
    const employee = await prisma.employee.findUnique({
      where: {
        id: employeeId,
      },
    });

    if (!employee) {
      return NextResponse.json(
        { message: "Employee not found" },
        { status: 404 }
      );
    }

    // Create/Update birthday record
    const record = await prisma.birthdayrecord.upsert({
      where: {
        employeeId_year: {
          employeeId,
          year,
        },
      },
      update: {},
      create: {
        employeeId,
        year,
      },
    });

    console.log("Birthday Record:", record.id);

    // Send Email
    await sendBirthdayGreetingEmail(
      employee.name,
      employee.email,
      record.id
    );

    // Mark email as sent ONLY after success
    await prisma.birthdayrecord.update({
      where: {
        id: record.id,
      },
      data: {
        emailSent: true,
      },
    });

    // Log activity
    await logActivity({
      userId: session?.user.id,
      userName: session?.user.name ?? "Unknown User",
      userEmail: session?.user.email ?? "unknown@wheelspin.com",

      action: ActivityAction.EMAIL,
      module: ActivityModule.BIRTHDAYS,

      description: `Manually sent birthday email to ${employee.name} (${employee.email}).`,
    });

    return NextResponse.json({
      success: true,
      message: "Birthday email sent successfully.",
      record,
    });
  } catch (error) {
    console.error("POST Birthday Email Error:", error);

    if (error instanceof Error) {
      console.error(error.message);
      console.error(error.stack);
    }

    return NextResponse.json(
      {
        message: "Failed to send birthday email",
      },
      {
        status: 500,
      }
    );
  }
}