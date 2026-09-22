import { existsSync } from 'node:fs';
import path from 'node:path';
import { config as loadEnv } from 'dotenv';
import { PrismaClient } from '@prisma/client';

/**
 * Next.js only auto-loads frontend/.env, while the Prisma CLI loads backend/.env.
 * Reading backend/.env here means DB_URL has to be set in exactly one file.
 */
function loadDatabaseEnv() {
  // Vercel already injects DB_URL. Skip the filesystem so the production
  // bundle does not trace the whole repo.
  if (process.env.DB_URL?.trim()) return;

  const fromRepoRoot = path.join(process.cwd(), 'backend', '.env');
  const fromFrontend = path.join(process.cwd(), '..', 'backend', '.env');
  const fromCwd = path.join(process.cwd(), '.env');

  if (existsSync(/*turbopackIgnore: true*/ fromRepoRoot)) loadEnv({ path: fromRepoRoot });
  else if (existsSync(/*turbopackIgnore: true*/ fromFrontend)) loadEnv({ path: fromFrontend });
  else if (existsSync(/*turbopackIgnore: true*/ fromCwd)) loadEnv({ path: fromCwd });
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
