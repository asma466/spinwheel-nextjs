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

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    // During build time on Vercel, DATABASE_URL might be missing.
    // We return a client without an adapter if we can't create one, 
    // or we could use a dummy string for the adapter to allow instantiation.
    // Since the schema has no datasource URL, Prisma 7 requires an adapter or a URL.
    return new PrismaClient();
  }

  const adapter = new PrismaMariaDb(connectionString);
  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

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

