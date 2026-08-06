
import { sendBirthdayGreetingEmail } from "@/lib/email";
import { generateSpinToken } from "@/lib/spinToken";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { logActivity } from "@/lib/logger";
import { ActivityAction, ActivityModule } from "@prisma/client";

export async function POST(req: Request) {
  const { employeeId } = await req.json();
  const employeeIdNumber = Number(employeeId); // convert string -> number
  const year = new Date().getFullYear();

  // fetch employee
  const employee = await prisma.employee.findUnique({
    where: { id: employeeIdNumber }
  });

  if (!employee) {
    return Response.json({ error: "Employee not found" });
  }

  // check if already processed this year
  const existing = await prisma.birthdayrecord.findUnique({
    where: {
      employeeId_year: {
        employeeId: employeeIdNumber,
        year
      }
    }
  });

  if (existing) {
    return Response.json({ message: "Birthday already processed this year" });
  }

  // generate spin token (optional, can remove if not needed)
  const token = generateSpinToken();

  // create birthday record and get the ID
  const birthdayRecord = await prisma.birthdayrecord.create({
    data: {
      year,
      spinToken: token, // optional, can remove if not using token
      emailSent: true,
      employee: {
        connect: { id: employeeIdNumber }
      }
    }
  });

  // send email using the record.id
  const link = `${process.env.APP_URL}/birthday-spin?x=${birthdayRecord.id}`;
  await sendBirthdayGreetingEmail(employee.email, employee.name, birthdayRecord.id);

  const session = await getServerSession(authOptions);
 await logActivity({
    userId: session?.user?.id ? String(session.user.id) : null,
    userName: session?.user?.name || session?.user?.email || "System",
    userEmail: session?.user?.email || "system@wheelspin.com",
    action: ActivityAction.EMAIL,
    module: ActivityModule.BIRTHDAYS,
    description: `Manually triggered birthday greeting email to ${employee.name} (${employee.email})`,
  });


  return Response.json({ success: true, recordId: birthdayRecord.id });
}