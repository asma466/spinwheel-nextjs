

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/getAdminSession";

type EmployeeWithDob = {
  id: number;
  name: string;
  department: string;
  dob: Date | null;
};
export const runtime = "nodejs";
export async function GET() {
   const session = await getAdminSession();

  if (!session) {
    return NextResponse.json(
      { message: "Unauthorized" },
      { status: 401 }
    );
  }
  try {
    const today = new Date();

    const [
      totalEmployees,
      availableGifts,
      totalGifts,
      todayBirthdays,
      pendingEmails,
      recentGiftActivity,
    ] = await Promise.all([

      // ✅ Total Employees
      prisma.employee.count(),

      // ✅ Available Gifts
      prisma.gift.count({
        where: {
          available: true,
        },
      }),

      // ✅ Total Gifts
      prisma.gift.count(),

      // ✅ Employees with DOB today (Optimized for MySQL)
      prisma.$queryRaw<EmployeeWithDob[]>`
        SELECT id, name, department, dob 
        FROM employee 
        WHERE MONTH(dob) = MONTH(CURRENT_DATE()) 
        AND DAY(dob) = DAY(CURRENT_DATE())
      `,

      // ✅ Pending Emails
      prisma.birthdayrecord.count({
        where: {
          emailSent: false,
          year: today.getUTCFullYear(),
        },
      }),

      // ✅ Recent Gift Activity
      prisma.birthdayrecord.findMany({
        where: {
          giftReceivedId: {
            not: null,
          },
        },

        include: {
          employee: true,

          gift: {
            select: {
              id: true,
              name: true,
              quantity: true,
              available: true,
            },
          },
        },

        orderBy: {
          giftReceivedAt: "desc",
        },

        take: 5,
      }),
    ]);

    // ✅ Get employee IDs
    const todayBirthdayIds = todayBirthdays.map(
      (emp: EmployeeWithDob) => emp.id
    );

    // ✅ Birthday Records
    const birthdayRecords = await prisma.birthdayrecord.findMany({
      where: {
        employeeId: {
          in: todayBirthdayIds,
        },

        year: today.getUTCFullYear(),
      },
    });

    return NextResponse.json({
      totalEmployees,
      availableGifts,
      totalGifts,
      todayBirthdays,
      pendingEmails,
      recentGiftActivity,
      birthdayRecords,
    });

  } catch (error) {
    // Keep error logging but maybe refine it
    console.error("Dashboard Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}