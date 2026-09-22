import { existsSync } from 'node:fs';
import path from 'node:path';
import { config as loadEnv } from 'dotenv';
import { PrismaClient } from '@prisma/client';

/**
 * Next.js only auto-loads frontend/.env, while the Prisma CLI loads backend/.env.
 * Reading backend/.env here means DB_URL has to be set in exactly one file.
 */
function loadDatabaseEnv() {
  const candidates = [
    path.resolve(process.cwd(), 'backend', '.env'),
    path.resolve(process.cwd(), '..', 'backend', '.env'),
    path.resolve(process.cwd(), '.env'),
  ];

  for (const file of candidates) {
    if (existsSync(file)) loadEnv({ path: file });
  }
}

loadDatabaseEnv();

if (!process.env.DB_URL?.trim()) {
  throw new Error(
    'DB_URL is missing. Open backend/.env and set DB_URL to your MongoDB connection string, then restart.',
  );
}

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
