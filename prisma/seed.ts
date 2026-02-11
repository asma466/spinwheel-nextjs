

// import { Prisma, PrismaClient } from '@/app/generated/prisma/client';
// import bcrypt from 'bcryptjs';
// import { log } from 'console';
// import { hash } from 'crypto';
// import 'dotenv/config'



// const prisma = new PrismaClient()

// const main = async () =>{

//     const hashedPassword = await bcrypt.hash("Asma@1943", 10)
//     //create data to seed the admin table
//     const adminData = await prisma.admin.create({
//         data: {
//             email: "asma@gmail.com",
//             password: hashedPassword

//         }
//     })
//     console.log("admin created:", adminData);
    
// };



// // export async function main() {
// //   for (const u of userData) {
// //     await prisma.user.create({ data: u });
// //   }
// // }

// main()
// .catch((e) => console.error(e))
// .finally( async ()=>{
//     await prisma.$disconnect();
// })
