// import { generateSpinToken } from "@/lib/spinToken";
// import { prisma } from "@/lib/prisma";
// import { sendBirthdayGreetingEmail } from "@/lib/email";

import { sendBirthdayGreetingEmail } from "@/lib/email";
import { generateSpinToken } from "@/lib/spinToken";
import { prisma } from "@/lib/prisma";
// export async function POST(req: Request) {

//   const { employeeId } = await req.json();

//   const employee = await prisma.employee.findUnique({
//     where: { id: employeeId }
//   });

//   if (!employee) {
//     return Response.json({ error: "Employee not found" });
//   }

//   const existing = await prisma.birthdayRecord.findFirst({
//     where: {
//       employeeId: employeeId,
//       emailSent: true
//     }
//   });

//   if (existing) {
//     return Response.json({ message: "Email already sent" });
//   }

//   const token = generateSpinToken();

//   const record = await prisma.birthdayRecord.create({
//     data: {
//       employeeId: employeeId,
//       spinToken: token,
//       emailSent: true
//     }
//   });

//   const link = `${process.env.APP_URL}/birthday-spin?token=${token}`;

//   await sendBirthdayGreetingEmail(employee.email, employee.name, link);

//   return Response.json({ success: true });
// }


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
  const existing = await prisma.birthdayRecord.findUnique({
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
  const birthdayRecord = await prisma.birthdayRecord.create({
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

  return Response.json({ success: true, recordId: birthdayRecord.id });
}