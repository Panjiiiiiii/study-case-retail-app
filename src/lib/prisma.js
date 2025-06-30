import { PrismaClient } from '@prisma/client';

// 👇 Buat variabel global yang bisa dikasih tipe
const globalForPrisma = globalThis;

/** @type {import('@prisma/client').PrismaClient} */
let prisma = globalForPrisma.prisma;

if (!prisma) {
  prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    errorFormat: 'pretty',
  });

  // simpan di globalThis saat di development
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
  }
}

export { prisma };
