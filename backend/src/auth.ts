/**
 * Minimal signed-cookie session for the single store-owner account.
 * Uses Web Crypto only, so the same helpers run in middleware (edge) and route handlers.
 */

export const SESSION_COOKIE = 'aurelia_admin';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret() {
  return process.env.AUTH_SECRET || 'aurelia-dev-secret';
}

function toBase64Url(bytes: Uint8Array) {
  let binary = '';
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/');
  return atob(padded + '='.repeat((4 - (padded.length % 4)) % 4));
}

async function sign(payload: string) {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret()),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
  return toBase64Url(new Uint8Array(signature));
}

export async function createSessionToken(username: string) {
  const payload = toBase64Url(
    new TextEncoder().encode(
      JSON.stringify({ username, exp: Date.now() + SESSION_MAX_AGE * 1000 }),
    ),
  );
  return `${payload}.${await sign(payload)}`;
}

export async function verifySessionToken(token: string | undefined | null) {
  if (!token) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;
  if ((await sign(payload)) !== signature) return null;

  try {
    const data = JSON.parse(fromBase64Url(payload)) as { username: string; exp: number };
    if (!data.username || !data.exp || data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_MAX_AGE,
  secure: process.env.NODE_ENV === 'production',
};
