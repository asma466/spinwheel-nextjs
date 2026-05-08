// import { PrismaClient } from "@prisma/client";

// const globalForPrisma = global as unknown as { prisma: PrismaClient };

// // export const prisma =
// //   globalForPrisma.prisma || new PrismaClient();

// export const prisma =
//   globalForPrisma.prisma ??
//   new PrismaClient({
//     log: ["error", "warn"],
//   });

// if (process.env.NODE_ENV !== "production") {
//   globalForPrisma.prisma = prisma;
// }


import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set.");
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const adapter = new PrismaMariaDb(databaseUrl);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// import { PrismaClient } from "@prisma/client"
// import { PrismaMariaDb } from "@prisma/adapter-mariadb"

// const adapter = new PrismaMariaDb(process.env.DATABASE_URL as string)

// declare global {
//   var prisma: PrismaClient | undefined
// }

// export const prisma =
//   globalThis.prisma ??
//   new PrismaClient({ adapter })

// if (process.env.NODE_ENV !== "production") {
//   globalThis.prisma = prisma
// }

