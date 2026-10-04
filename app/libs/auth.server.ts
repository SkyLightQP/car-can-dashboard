import { createCookie, type MiddlewareFunction, redirect } from 'react-router';

import { collectorContext, createCollectorClient } from '@/libs/collector-client.server';

const COLLECTOR_AUTH_URL = process.env.COLLECTOR_AUTH_URL ?? 'http://localhost:3000/auth';
const DASHBOARD_ORIGIN = process.env.DASHBOARD_ORIGIN ?? 'http://localhost:5173';
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60;

const tokenCookie = createCookie('collector_token', {
  httpOnly: true,
  sameSite: 'lax',
  path: '/',
  maxAge: SESSION_MAX_AGE_SECONDS,
  secure: process.env.NODE_ENV === 'production',
});

export type SignInResult = { ok: true; token: string } | { ok: false; reason: 'invalid' | 'unavailable' };

const authRequestHeaders = { 'content-type': 'application/json', origin: DASHBOARD_ORIGIN };

function bearer(token: string): HeadersInit {
  return { ...authRequestHeaders, authorization: `Bearer ${token}` };
}

export async function readToken(request: Request): Promise<string | null> {
  const token: unknown = await tokenCookie.parse(request.headers.get('Cookie'));
  return typeof token === 'string' && token ? token : null;
}

export function saveTokenCookie(token: string): Promise<string> {
  return tokenCookie.serialize(token);
}

export function clearTokenCookie(): Promise<string> {
  return tokenCookie.serialize('', { maxAge: 0 });
}

export async function signIn(email: string, password: string): Promise<SignInResult> {
  const response = await fetch(`${COLLECTOR_AUTH_URL}/sign-in/email`, {
    method: 'POST',
    headers: authRequestHeaders,
    body: JSON.stringify({ email, password }),
  }).catch(() => null);

  const token = response?.headers.get('set-auth-token');
  if (response?.ok && token) return { ok: true, token };
  if (response?.status === 401) return { ok: false, reason: 'invalid' };
  return { ok: false, reason: 'unavailable' };
}

export async function signOut(token: string): Promise<void> {
  await fetch(`${COLLECTOR_AUTH_URL}/sign-out`, { method: 'POST', headers: bearer(token), body: '{}' }).catch(
    () => null
  );
}

export async function hasSession(token: string): Promise<boolean> {
  const response = await fetch(`${COLLECTOR_AUTH_URL}/get-session`, { headers: bearer(token) });
  if (!response.ok) {
    throw new Error(`collector 세션 확인 실패: HTTP ${response.status}`);
  }
  return (await response.json()) !== null;
}

export const requireCollectorSession: MiddlewareFunction<Response> = async ({ request, context }) => {
  const token = await readToken(request);
  if (!token || !(await hasSession(token))) {
    throw redirect('/login', { headers: { 'Set-Cookie': await clearTokenCookie() } });
  }
  context.set(collectorContext, createCollectorClient(token));
};
