import cron from "node-cron";
import { prisma } from "@/lib/prisma";
import { sendBirthdayGreetingEmail } from "@/lib/email";
import { Employee } from "@/src/types";

console.log("Birthday cron initialized...");

cron.schedule("12 11 * * *", async () => {
  console.log("Running birthday cron at 10:25 AM");

  try {
    const today = new Date();
    const month = today.getMonth();
    const day = today.getDate();
    const year = today.getFullYear();

    // const employees = await prisma.employee.findMany();
const employees: Employee[] = await prisma.employee.findMany();
    const birthdayEmployees = employees.filter((emp : Employee) => {
       if (!emp.dob) return false;
      const dob = new Date(emp.dob);
      return dob.getMonth() === month && dob.getDate() === day;
    });

    for (const emp of birthdayEmployees) {
      const existing = await prisma.birthdayRecord.findUnique({
        where: {
          employeeId_year: {
            employeeId: emp.id,
            year
          }
        }
      });

      if (existing) continue;

      const record = await prisma.birthdayRecord.create({
        data: {
          year,
          employeeId: emp.id,
          emailSent: true,
          autoEmail: true,
          emailSentAt: new Date()
        }
      });

      await sendBirthdayGreetingEmail(emp.name, emp.email, record.id);

      console.log(`Birthday email sent to ${emp.name}`);
    }

  } catch (err) {
    console.error("Birthday cron failed:", err);
  }
});