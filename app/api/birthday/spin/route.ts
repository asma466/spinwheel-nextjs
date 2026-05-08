
// import { Prisma } from "@/app/generated/prisma/browser";
// import { prisma } from "@/lib/prisma";
// export async function POST(req: Request) {

//   const { token } = await req.json();

//   const record = await prisma.birthdayRecord.findUnique({
//     where: { spinToken: token }
//   });

//   if (!record || record.spinUsed) {
//     return Response.json({ error: "Invalid or already used token" });
//   }

//   const prizes = ["Gift Card", "Extra Leave", "Chocolate Box", "Coffee Mug"];

//   const prize = prizes[Math.floor(Math.random() * prizes.length)];

//   await prisma.birthdayRecord.update({
//     where: { id: record.id },
//     data: {
//       spinUsed: true,
//       prize: prize
//     }
//   });

//   return Response.json({ prize });
// }



import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {

  const { token } = await req.json();

  const record = await prisma.birthdayrecord.findUnique({
    where: { spinToken: token }
  });

  if (!record || record.spinCompleted) {
    return Response.json({ error: "Invalid or already used token" });
  }

  const prizes = ["Gift Card", "Extra Leave", "Chocolate Box", "Coffee Mug"];

  const prize = prizes[Math.floor(Math.random() * prizes.length)];

  await prisma.birthdayrecord.update({
    where: { id: record.id },
    data: {
      spinCompleted: true
    }
  });

  return Response.json({ prize });
}