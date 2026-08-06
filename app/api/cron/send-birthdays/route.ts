// import { generateSpinToken } from "@/lib/spinToken";
// import { prisma } from "@/lib/prisma";
// import { sendBirthdayGreetingEmail } from "@/lib/email";

// // This endpoint is meant to be pinged daily by a cron job (like PM2 or Vercel Cron)
// // It finds all employees whose birthday is today, checks if an email has already been sent this year, and sends one if not.
// export async function GET(req: Request) {
//   try {
//     const today = new Date();
//     const month = today.getMonth();
//     const day = today.getDate();
//     const year = today.getFullYear();

//     console.log(`[CRON] Starting daily birthday email job for ${today.toDateString()}...`);

//     // 1. Fetch all employees
//     const employees = await prisma.employee.findMany();

//     // 2. Filter employees whose birthday is today (ignoring year and timezones)
//     const todayString = `${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

//     let emailsSentCount = 0;
//     const errors: any[] = [];
//     // const birthdayEmployees = employees.filter(emp => {
//     //   if (!emp.dob) return false;

//     //   // Some DBs return string, some return Date object. Ensure it's a date.
//     //   const dobDate = new Date(emp.dob);
//     //   if (isNaN(dobDate.getTime())) return false;

//     //   // Extract month and day (UTC or Local can be tricky, let's use the raw string if possible, or UTC as fallback)
//     //   // const empMonth = String(dobDate.getUTCMonth() + 1).padStart(2, '0');
//     //   // const empDay = String(dobDate.getUTCDate()).padStart(2, '0');
//     //   const empMonth = String(dobDate.getMonth() + 1).padStart(2, '0');
//     //   const empDay = String(dobDate.getDate()).padStart(2, '0');
//     //   const empDobString = `${empMonth}-${empDay}`;

//     //   const debugInfo = `Checking employee: ${emp.name} | DB DOB: ${emp.dob} | Parsed: ${empDobString} | Expected: ${todayString}`;
//     //   console.log(`[CRON-DEBUG] ${debugInfo}`);

//     //   if (emp.name.toLowerCase().includes('asma')) {
//     //     errors.push({ type: 'debug', info: debugInfo });
//     //   }

//     //   return empDobString === todayString;
//     // });
//     const birthdayEmployees = employees.filter(emp => {
//   if (!emp.dob) return false;

//   const dobDate = new Date(emp.dob);
//   if (isNaN(dobDate.getTime())) return false;

//   const empMonth = dobDate.getMonth();
//   const empDay = dobDate.getDate();

//   const birthdayThisYear = new Date(year, empMonth, empDay);

//   const isBirthdayToday =
//     empMonth === month && empDay === day;

//   // const missedBirthday =
//   //   birthdayThisYear < today;
//   const missedBirthday =
//   birthdayThisYear < today &&
//   birthdayThisYear.getFullYear() === year;

//   const debugInfo = `Checking employee: ${emp.name} | DOB: ${dobDate.toDateString()} | Today: ${today.toDateString()} | isToday: ${isBirthdayToday} | missed: ${missedBirthday}`;
//   console.log(`[CRON-DEBUG] ${debugInfo}`);

//   return isBirthdayToday || missedBirthday;
// });
//     console.log(`[CRON] Today is ${todayString}. Found ${birthdayEmployees.length} employees with a birthday today.`);



//     // 3. Process each birthday employee
//     for (const emp of birthdayEmployees) {
//       try {
//         // Check if we already processed them this year
//         const existing = await prisma.birthdayRecord.findUnique({
//           where: {
//             employeeId_year: {
//               employeeId: emp.id,
//               year
//             }
//           }
//         });

//         if (existing) {
//           console.log(`[CRON] Employee ${emp.name} already received their birthday email this year. Skipping.`);
//           continue;
//         }

//         // Generate token and create record
//         const token = generateSpinToken();

//         const record = await prisma.birthdayRecord.create({
//           data: {
//             year,
//             employeeId: emp.id,
//             spinToken: token,
//             emailSent: true,
//             autoEmail: true,
//             emailSentAt: new Date()
//           }
//         });

//         // Send Email
//         await sendBirthdayGreetingEmail(emp.name, emp.email, record.id);

//         console.log(`[CRON] ✅ Successfully sent birthday email to ${emp.name} (${emp.email})`);
//         emailsSentCount++;

//       } catch (err) {
//         console.error(`[CRON] ❌ Failed to send email to ${emp.name}:`, err);
//         errors.push({ employeeId: emp.id, error: String(err) });
//       }
//     }

//     console.log(`[CRON] Job finished. Sent ${emailsSentCount} emails.`);

//     return Response.json({
//       success: true,
//       message: `Job completed`,
//       emailsSent: emailsSentCount,
//       errors: errors.length > 0 ? errors : undefined
//     });

//   } catch (globalError) {
//     console.error("[CRON] Fatal error in birthday cron job:", globalError);
//     return Response.json({ success: false, error: String(globalError) }, { status: 500 });
//   }
// }


import { generateSpinToken } from "@/lib/spinToken";
import { prisma } from "@/lib/prisma";
import { sendBirthdayGreetingEmail } from "@/lib/email";
import { logActivity } from "@/lib/logger";
import { ActivityAction, ActivityModule } from "@prisma/client";
export const runtime = "nodejs";
export async function GET(req: Request) {
  try {
    const today = new Date();
    const month = today.getMonth();
    const day = today.getDate();
    const year = today.getFullYear();

    console.log(`[CRON] Starting daily birthday email job for ${today.toDateString()}...`);

    const employees = await prisma.employee.findMany();

    let emailsSentCount = 0;
    const errors: any[] = [];

    for (const emp of employees) {
      try {
        if (!emp.dob) continue;

        const dobDate = new Date(emp.dob);
        if (isNaN(dobDate.getTime())) continue;

        const empMonth = dobDate.getMonth();
        const empDay = dobDate.getDate();

        const birthdayThisYear = new Date(year, empMonth, empDay);

        const isBirthdayToday =
          empMonth === month && empDay === day;

        const missedBirthday =
          birthdayThisYear < today;

        const debugInfo = `Checking: ${emp.name} | DOB: ${dobDate.toDateString()} | Today: ${today.toDateString()} | isToday: ${isBirthdayToday} | missed: ${missedBirthday}`;
        console.log(`[CRON-DEBUG] ${debugInfo}`);

        // ❌ Skip if neither today nor missed
        if (!isBirthdayToday ) {
          continue;
        }

        // 🔒 Check if already sent this year
        const existing = await prisma.birthdayrecord.findUnique({
          where: {
            employeeId_year: {
              employeeId: emp.id,
              year
            }
          }
        });

        if (existing) {
          console.log(`[CRON] ${emp.name} already received email this year. Skipping.`);
          continue;
        }

        // 🎁 Generate spin token + record
        const token = generateSpinToken();

        const record = await prisma.birthdayrecord.create({
          data: {
            year,
            employeeId: emp.id,
            spinToken: token,
            emailSent: true,
            autoEmail: true,
            emailSentAt: new Date()
          }
        });

        // 📧 Send email
        await sendBirthdayGreetingEmail(emp.name, emp.email, record.id);

// await logActivity({
//   userId: null,
//   userName: "System",
//   userEmail: "system@wheelspin.com",
//   action: ActivityAction.EMAIL,
//   module: ActivityModule.BIRTHDAYS,
//   description: `Birthday email sent to ${emp.name} (${emp.email})`,
// });
 
console.log("📍 BEFORE sendBirthdayGreetingEmail");

await sendBirthdayGreetingEmail(emp.name, emp.email, record.id);

console.log("📍 AFTER sendBirthdayGreetingEmail");

await logActivity({
  userId: null,
  userName: "System",
  userEmail: "system@wheelspin.com",
  action: ActivityAction.EMAIL,
  module: ActivityModule.BIRTHDAYS,
  description: `Birthday email sent to ${emp.name} (${emp.email})`,
});

console.log("📍 AFTER logActivity");

console.log(`✅ Sent birthday email to ${emp.name} (${emp.email})`);


        console.log(`✅ Sent birthday email to ${emp.name} (${emp.email})`);
        emailsSentCount++;

      } catch (err) {
        console.error(`❌ Failed for ${emp.name}:`, err);
        await logActivity({
    userId: null,
    userName: "System",
    userEmail: "system@wheelspin.com",
    action: ActivityAction.EMAIL,
    module: ActivityModule.BIRTHDAYS,
    description: `Failed to send birthday email to ${emp.name} (${emp.email}). Error: ${
      err instanceof Error ? err.message : String(err)
    }`,
  });
        errors.push({ employeeId: emp.id, error: String(err) });
      }
    }

    console.log(`[CRON] Job finished. Sent ${emailsSentCount} emails.`);

    return Response.json({
      success: true,
      message: "Job completed",
      emailsSent: emailsSentCount,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (globalError) {
    console.error("[CRON] Fatal error:", globalError);

    return Response.json(
      { success: false, error: String(globalError) },
      { status: 500 }
    );
  }
}