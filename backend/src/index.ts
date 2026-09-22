/**
 * Server-only entry point. Importing this pulls in the Prisma client, so it must
 * never be imported from a client component or from middleware.
 *
 * Client-safe imports live in `@aurelia/backend/shared`, and the edge-safe session
 * helpers live in `@aurelia/backend/auth`.
 */

export { prisma } from './prisma';
export { ensureAdmin, verifyAdmin } from './admin';
export * from './queries';
export * from './images';
export * from './utils';
export * from './shared';
export * from './auth';
