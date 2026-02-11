// import 'dotenv/config';

// import bcrypt from 'bcryptjs';

// import { PrismaClient} from '@prisma/client'

// const prisma = new PrismaClient()

// const main = async () => {
//   const hashedPassword = await bcrypt.hash("Asma@1943", 10);
  
//   // create data to seed the admin table
//   const adminData = await prisma.admin.create({
//     data: {
//       email: "asma@gmail.com",
//       password: hashedPassword,
//     },
//   });
  
//   console.log("Admin created:", adminData);
// };

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });