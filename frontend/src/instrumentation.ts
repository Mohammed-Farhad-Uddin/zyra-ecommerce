/**
 * Runs once when the Next.js server starts (Node runtime only).
 * Makes sure the single admin account exists in MongoDB before anyone can log in.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { ensureAdmin } = await import('@aurelia/backend');
    await ensureAdmin();
  }
}
