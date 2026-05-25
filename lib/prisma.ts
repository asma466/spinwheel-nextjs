// import { PrismaClient } from "@prisma/client";
// import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// const globalForPrisma = globalThis as unknown as {
//   prisma?: PrismaClient;
// };

// const createPrismaClient = () => {
//   const connectionString = process.env.DATABASE_URL;

//   if (!connectionString) {
//     // During build time on Vercel, DATABASE_URL might be missing.
//     return new PrismaClient();
//   }

//   // The mariadb driver explicitly requires 'mariadb://' protocol
//   const mariadbUrl = connectionString.replace(/^mysql:\/\//, 'mariadb://');
//   const adapter = new PrismaMariaDb(mariadbUrl);
//   return new PrismaClient({ adapter });
// };

// export const prisma = globalForPrisma.prisma ?? createPrismaClient();

// if (process.env.NODE_ENV !== "production") {
//   globalForPrisma.prisma = prisma;
// }

// import { PrismaClient } from "@prisma/client";

// const prismaClientSingleton = () => {
//   return new PrismaClient();
// };

// type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClientSingleton | undefined;
// };

// export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

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