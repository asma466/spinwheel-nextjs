import { prisma } from "@/lib/prisma";
import { sendBirthdayGreetingEmail } from "@/lib/email";
export const runtime = "nodejs";
export async function GET() {
  try {
    console.log("[CRON] Retrying failed birthday emails...");

    // 👉 Get all failed emails
    const failedRecords = await prisma.birthdayrecord.findMany({
      where: {
        emailSent: false
      },
      include: {
        employee: true
      }
    });

    let successCount = 0;

    for (const record of failedRecords) {
      try {
        await sendBirthdayGreetingEmail(
          record.employee.name,
          record.employee.email,
          record.id
        );

        // ✅ mark as sent
        await prisma.birthdayrecord.update({
          where: { id: record.id },
          data: {
            emailSent: true,
            emailSentAt: new Date()
          }
        });

        console.log(`✅ Resent email to ${record.employee.email}`);
        successCount++;

      } catch (err) {
        console.error(`❌ Still failed: ${record.employee.email}`, err);
      }
    }

    return Response.json({
      success: true,
      retried: failedRecords.length,
      successCount
    });

  } catch (error) {
    console.error("Retry cron error:", error);
    return Response.json({ error: "Retry failed" }, { status: 500 });
  }
}