// import cron from "node-cron";
// import { prisma } from "@/lib/prisma";

// cron.schedule('25 10 * * *', async () => {
//   console.log("Running birthday check at midnight");

//   const today = new Date();
//   const month = today.getMonth() + 1; // 1-12
//   const day = today.getDate();

//   const employees = await prisma.employee.findMany({
//     where: {
//       dob: {
//         gte: new Date(`${today.getFullYear()}-${month}-${day}T00:00:00Z`),
//         lte: new Date(`${today.getFullYear()}-${month}-${day}T23:59:59Z`),
//       }
//     }
//   });

//   for (const employee of employees) {
//     await fetch(`${process.env.APP_URL}/api/birthday/send`, {
//       method: "POST",
//       body: JSON.stringify({ employeeId: employee.id }),
//       headers: { "Content-Type": "application/json" }
//     });
//   }
// });


// import next from "next";
// import http from "http";
// import "./src/cron/birthdayCron";

// const app = next({ dev: false });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//   http.createServer((req, res) => {
//     handle(req, res);
//   }).listen(3000, () => {
//     console.log("Server running on port 3000");
//   });
// });