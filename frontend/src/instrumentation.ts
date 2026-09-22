/**
 * Runs once when the Next.js server starts (Node runtime only).
 * Makes sure the single admin account exists in MongoDB before anyone can log in.
 */
export async function register() {
  // `next build` also loads this file. Seeding needs a live MongoDB connection,
  // so it runs only when the server actually starts.
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  if (process.env.NEXT_PHASE === 'phase-production-build') return;

  const { ensureAdmin } = await import('@aurelia/backend');
  await ensureAdmin();
}
