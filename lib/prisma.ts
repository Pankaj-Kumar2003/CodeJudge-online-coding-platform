import { PrismaClient } from "@prisma/client";

// Declare a global variable with an explicit type to support the Next.js dev server hot-reloading pattern
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Initialize the type-safe client instance
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
