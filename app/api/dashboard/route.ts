// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function GET() {
//   try {
//     const totalEmployees = await prisma.employee.count();
//     const availableGifts = await prisma.gift.count({
//       where: { available: true },
//     });

//     const totalGifts = await prisma.gift.count();

//     return NextResponse.json({
//       totalEmployees,
//       availableGifts,
//       totalGifts,
//     });
//   } catch (error) {
//     console.error("DASHBOARD ERROR:", error);
//     return NextResponse.json(
//       { message: "Failed to fetch dashboard stats" },
//       { status: 500 }
//     );
//   }
// }


// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function GET() {
//   try {
//     const today = new Date();
//     const month = today.getMonth() + 1;
//     const day = today.getDate();

//     const [
//       totalEmployees,
//       availableGifts,
//       totalGifts,
//       todayBirthdays,
//       pendingEmails,
//       recentGiftActivity
//     ] = await Promise.all([
//       prisma.employee.count(),

//       prisma.gift.count({
//         where: { available: true },
//       }),

//       prisma.gift.count(),

//       prisma.employee.findMany({
//         // where: {
//         //   AND: [
//         //     { dob: { not: null } },
//         //   ],
//         // },
  
//         select: {
//           id: true,
//           name: true,
//           department: true,
//           dob: true,
//         },
//       }),

//       prisma.birthdayRecord.count({
//         where: {
//           emailSent: false,
//           year: today.getFullYear(),
//         },
//       }),

//       prisma.birthdayRecord.findMany({
//         where: {
//           giftReceived: { isNot: null },
//         },
//         include: {
//           employee: true,
//           giftReceived: true,
//         },
//         orderBy: {
//           giftReceivedAt: "desc",
//         },
//         take: 5,
//       }),
//     ]);

//     // Filter birthdays by month/day only
//     const filteredBirthdays = todayBirthdays.filter((emp) => {
//       const dob = new Date(emp.dob);
//       return dob.getMonth() + 1 === month && dob.getDate() === day;
//     });

//     return NextResponse.json({
//       totalEmployees,
//       availableGifts,
//       totalGifts,
//       todayBirthdays: filteredBirthdays,
//       pendingEmails,
//       recentGiftActivity,
//     });
//   } catch (error) {
//     console.error("Dashboard Error:", error);
//     return NextResponse.json(
//       { message: "Failed to fetch dashboard data" },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const today = new Date();

    const [
      totalEmployees,
      availableGifts,
      totalGifts,
      employeesWithDob,
      pendingEmails,
      recentGiftActivity,
    ] = await Promise.all([
      prisma.employee.count(),

      prisma.gift.count({
        where: { available: true },
      }),

      prisma.gift.count(),

      prisma.employee.findMany({
        // where: {
        //   dob: { not: null },
        // },
        select: {
          id: true,
          name: true,
          department: true,
          dob: true,
        },
      }),

      prisma.birthdayRecord.count({
        where: {
          emailSent: false,
          year: today.getUTCFullYear(),
        },
      }),

      prisma.birthdayRecord.findMany({
        where: {
          giftReceived: { isNot: null },
        },
        include: {
          employee: true,
          giftReceived: true,
        },
        orderBy: {
          giftReceivedAt: "desc",
        },
        take: 5,
      }),
    ]);

    // 🔥 Correct UTC-based birthday filtering
    const todayBirthdays = employeesWithDob.filter((emp) => {
      const dob = new Date(emp.dob);

        // 👇 ADD LOG HERE
  console.log({
    employee: emp.name,
    todayUTC: today.toISOString(),
    dobUTC: dob.toISOString(),
    dobMonthUTC: dob.getUTCMonth(),
    dobDateUTC: dob.getUTCDate(),
    todayMonthUTC: today.getUTCMonth(),
    todayDateUTC: today.getUTCDate(),
  });

      return (
        dob.getUTCMonth() === today.getUTCMonth() &&
        dob.getUTCDate() === today.getUTCDate()
      );
    });

    return NextResponse.json({
      totalEmployees,
      availableGifts,
      totalGifts,
      todayBirthdays,
      pendingEmails,
      recentGiftActivity,
    });
  } catch (error) {
    console.error("Dashboard Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}

