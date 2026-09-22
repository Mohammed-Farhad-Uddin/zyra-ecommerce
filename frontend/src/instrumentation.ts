/**
 * Runs once when the Next.js server starts (Node runtime only).
 * Makes sure the single admin account exists in MongoDB before anyone can log in.
 */
export async function register() {
  // This import must stay inside the nodejs branch. Next strips that branch
  // from the edge bundle; pulling it out makes webpack try to bundle node:fs.
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // `next build` also calls register(). Seeding needs a live MongoDB connection,
    // so it runs only when the server actually starts.
    if (process.env.NEXT_PHASE === 'phase-production-build') return;

    const { ensureAdmin } = await import('@aurelia/backend');
    await ensureAdmin();
  }
}
