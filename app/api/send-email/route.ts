import { prisma } from "@/lib/prisma";
import { sendBirthdayGreetingEmail } from "@/lib/email";

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
      const existing = await prisma.birthdayRecord.findUnique({
        where: {
          employeeId_year: {
            employeeId: emp.id,
            year
          }
        }
      });

      if (existing) continue;

      // Create record
      const record = await prisma.birthdayRecord.create({
        data: {
          year,
          employeeId: emp.id,
          emailSent: true,
          autoEmail: true,
           emailSentAt: new Date()   // 👈 SAVE TIMESTAMP
        }
      });

      // Send email
      await sendBirthdayGreetingEmail(emp.name, emp.email, record.id);
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