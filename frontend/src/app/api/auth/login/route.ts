import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { verifyAdmin } from '@aurelia/backend';
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from '@aurelia/backend/auth';

export async function POST(request: Request) {
  const body = await request.json();
  const username = String(body.username ?? '').trim();
  const password = String(body.password ?? '');

  if (!username || !password)
    return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });

  const admin = await verifyAdmin(username, password);
  if (!admin)
    return NextResponse.json({ error: 'Incorrect username or password' }, { status: 401 });

  const token = await createSessionToken(admin.username);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, sessionCookieOptions);

  return NextResponse.json({ ok: true });
}
