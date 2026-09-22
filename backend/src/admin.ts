import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

/** The only account that can sign in to the admin panel. */
export const ADMIN_USERNAME = 'Mohammed Farhad Uddin';
const ADMIN_PASSWORD = '!@#Farhad456';

/**
 * Creates the owner account, or resets its password to the one above.
 * Safe to call on every server start.
 */
export async function ensureAdmin() {
  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);

  await prisma.admin.upsert({
    where: { username: ADMIN_USERNAME },
    update: { passwordHash },
    create: { username: ADMIN_USERNAME, passwordHash },
  });
}

export async function verifyAdmin(username: string, password: string) {
  const name = username.trim();
  if (!name || !password) return null;

  const admin = await prisma.admin.findUnique({ where: { username: name } });
  if (!admin) return null;

  const matches = await bcrypt.compare(password, admin.passwordHash);
  return matches ? admin : null;
}
