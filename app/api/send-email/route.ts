import { prisma } from "@/lib/prisma";
import { sendBirthdayGreetingEmail } from "@/lib/email";
import { logActivity } from "@/lib/logger";
import { ActivityAction, ActivityModule } from "@prisma/client";

export const runtime = "nodejs";
export async function GET() {
  try {
    const today = new Date();
    const month = today.getMonth();
    const day = today.getDate();
    const year = today.getFullYear();

    // Find employees whose birthday is today
    const employees = await prisma.employee.findMany();

    const birthdayEmployees = employees.filter(emp => {
      const dob = new Date(emp.dob);
      return dob.getMonth() === month && dob.getDate() === day;
    });

    for (const emp of birthdayEmployees) {

      // Check if already processed this year
      const existing = await prisma.birthdayrecord.findUnique({
        where: {
          employeeId_year: {
            employeeId: emp.id,
            year
          }
        }
      });

      if (existing) continue;

      // Create record
      // const record = await prisma.birthdayrecord.create({
      //   data: {
      //     year,
      //     employeeId: emp.id,
      //     // emailSent: true,
      //     emailSent:false,
      //     autoEmail: true,
      //      emailSentAt: new Date()   // 👈 SAVE TIMESTAMP
      //   }
      // });

      const record = await prisma.birthdayrecord.create({
  data: {
    year,
    employeeId: emp.id,
    emailSent: false,
    autoEmail: true,
    emailSentAt: new Date(),
    updatedAt: new Date(),
  },
});

      // Send email
      // await sendBirthdayGreetingEmail(emp.name, emp.email, record.id);
        try {
        // ✅ Step 2: Send email
        await sendBirthdayGreetingEmail(emp.name, emp.email, record.id);

        // ✅ Step 3: Update status ONLY if success
        await prisma.birthdayrecord.update({
          where: { id: record.id },
          data: {
            emailSent: true,
            emailSentAt: new Date()
          }
        });

        console.log(`✅ Email sent to ${emp.email}`);

        // await logActivity({
        //   action: "SEND_BIRTHDAY_EMAIL_SUCCESS",
        //   details: `Successfully sent birthday greeting email to ${emp.name} (${emp.email}) (Record ID: ${record.id})`,
        // });

        await logActivity({
  userId: null,
  userName: "System",
  userEmail: "system@wheelspin.com",

  action: ActivityAction.EMAIL,
  module: ActivityModule.BIRTHDAYS,

  description: `Birthday email sent successfully to ${emp.name} (${emp.email})`,
});


      } catch (err) {
        console.error(`❌ Failed to send email to ${emp.email}`, err);

        // await logActivity({
        //   action: "SEND_BIRTHDAY_EMAIL_FAILURE",
        //   details: `Failed to send birthday greeting email to ${emp.name} (${emp.email}) (Record ID: ${record.id}). Error: ${err instanceof Error ? err.message : String(err)}`,
        // });

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

        // ❗ emailSent stays false → can retry later
      }
    
    }

    return Response.json({
      success: true,
      processed: birthdayEmployees.length
    });

  } catch (error) {
    console.error("Cron birthday error:", error);
    return Response.json({ error: "Cron failed" }, { status: 500 });
  }
}