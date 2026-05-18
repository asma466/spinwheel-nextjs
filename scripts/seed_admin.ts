import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import bcrypt from 'bcryptjs';
import 'dotenv/config';

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set in .env');
}

const adapter = new PrismaMariaDb(databaseUrl);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = 'admin@example.com';
  const password = 'adminpassword123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.employee.upsert({
    where: { email },
    update: {
      password: hashedPassword,
      role: 'ADMIN',
    },
    create: {
      email,
      name: 'Admin User',
      password: hashedPassword,
      role: 'ADMIN',
      department: 'IT',
      dob: new Date('1990-01-01'),
    },
  });

  console.log('Admin user created/updated:', admin.email);
  console.log('Password set to:', password);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
