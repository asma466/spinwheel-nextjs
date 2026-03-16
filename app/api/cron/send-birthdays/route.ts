import { generateSpinToken } from "@/lib/spinToken";
import { prisma } from "@/lib/prisma";
import { sendBirthdayGreetingEmail } from "@/lib/email";

// This endpoint is meant to be pinged daily by a cron job (like PM2 or Vercel Cron)
// It finds all employees whose birthday is today, checks if an email has already been sent this year, and sends one if not.
export async function GET(req: Request) {
  try {
    const today = new Date();
    const month = today.getMonth();
    const day = today.getDate();
    const year = today.getFullYear();

    console.log(`[CRON] Starting daily birthday email job for ${today.toDateString()}...`);

    // 1. Fetch all employees
    const employees = await prisma.employee.findMany();

    // 2. Filter employees whose birthday is today (ignoring year and timezones)
    const todayString = `${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

    const birthdayEmployees = employees.filter(emp => {
      if (!emp.dob) return false;
      
      // Some DBs return string, some return Date object. Ensure it's a date.
      const dobDate = new Date(emp.dob);
      if (isNaN(dobDate.getTime())) return false;

      // Extract month and day (UTC or Local can be tricky, let's use the raw string if possible, or UTC as fallback)
      const empMonth = String(dobDate.getUTCMonth() + 1).padStart(2, '0');
      const empDay = String(dobDate.getUTCDate()).padStart(2, '0');
      const empDobString = `${empMonth}-${empDay}`;
      
      console.log(`[CRON-DEBUG] Checking employee: ${emp.name} | DB DOB: ${emp.dob} | Parsed: ${empDobString} | Expected: ${todayString}`);
      
      return empDobString === todayString;
    });

    console.log(`[CRON] Today is ${todayString}. Found ${birthdayEmployees.length} employees with a birthday today.`);

    let emailsSentCount = 0;
    const errors = [];

    // 3. Process each birthday employee
    for (const emp of birthdayEmployees) {
      try {
        // Check if we already processed them this year
        const existing = await prisma.birthdayRecord.findUnique({
          where: {
            employeeId_year: {
              employeeId: emp.id,
              year
            }
          }
        });

        if (existing) {
          console.log(`[CRON] Employee ${emp.name} already received their birthday email this year. Skipping.`);
          continue;
        }

        // Generate token and create record
        const token = generateSpinToken();

        const record = await prisma.birthdayRecord.create({
          data: {
            year,
            employeeId: emp.id,
            spinToken: token,
            emailSent: true,
            autoEmail: true,
            emailSentAt: new Date()
          }
        });

        // Send Email
        await sendBirthdayGreetingEmail(emp.name, emp.email, record.id);
        
        console.log(`[CRON] ✅ Successfully sent birthday email to ${emp.name} (${emp.email})`);
        emailsSentCount++;

      } catch (err) {
        console.error(`[CRON] ❌ Failed to send email to ${emp.name}:`, err);
        errors.push({ employeeId: emp.id, error: String(err) });
      }
    }

    console.log(`[CRON] Job finished. Sent ${emailsSentCount} emails.`);

    return Response.json({
      success: true,
      message: `Job completed`,
      emailsSent: emailsSentCount,
      errors: errors.length > 0 ? errors : undefined
    });

  } catch (globalError) {
    console.error("[CRON] Fatal error in birthday cron job:", globalError);
    return Response.json({ success: false, error: String(globalError) }, { status: 500 });
  }
}
