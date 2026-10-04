import { redirect } from 'react-router';

import { clearTokenCookie, readToken, signOut } from '@/libs/auth.server';

import type { Route } from './+types/logout';

export async function action({ request }: Route.ActionArgs) {
  const token = await readToken(request);
  if (token) await signOut(token);
  throw redirect('/login', { headers: { 'Set-Cookie': await clearTokenCookie() } });
}

export function loader() {
  throw redirect('/');
}
