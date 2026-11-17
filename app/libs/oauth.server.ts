const COLLECTOR_AUTH_URL = process.env.COLLECTOR_AUTH_URL ?? 'http://localhost:3000/auth';
const DASHBOARD_ORIGIN = process.env.DASHBOARD_ORIGIN ?? 'http://localhost:5173';
const SIGNATURE_QUERY_KEYS = ['sig', 'exp', 'ba_iat', 'ba_param', 'ba_pl'];

export type OAuthFailure = 'expired' | 'invalid' | 'unavailable';
export type OAuthRedirect = { ok: true; url: string } | { ok: false; reason: OAuthFailure };

export const oauthFailureMessages: Record<OAuthFailure, string> = {
  expired: '연결 요청이 만료되었습니다. AI 앱에서 다시 연결해 주세요.',
  invalid: '이메일 또는 비밀번호가 올바르지 않습니다.',
  unavailable: '수집 서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.',
};

function oauthHeaders(token?: string): Record<string, string> {
  const headers: Record<string, string> = {
    'content-type': 'application/json',
    accept: 'application/json',
    origin: DASHBOARD_ORIGIN,
  };
  if (token) headers.authorization = `Bearer ${token}`;
  return headers;
}

async function readJson(response: Response): Promise<Record<string, unknown>> {
  const body: unknown = await response.json().catch(() => null);
  return typeof body === 'object' && body !== null ? (body as Record<string, unknown>) : {};
}

async function classifyFailure(response: Response | null): Promise<OAuthFailure> {
  if (!response) return 'unavailable';

  const body = await readJson(response);
  const error = typeof body.error === 'string' ? body.error : '';
  const message = typeof body.message === 'string' ? body.message : '';
  if (error === 'invalid_signature' || /서명|만료|signature|expired/i.test(message)) return 'expired';
  if (response.status === 401) return 'invalid';
  return 'unavailable';
}

async function readRedirect(response: Response | null): Promise<OAuthRedirect> {
  if (!response?.ok) return { ok: false, reason: await classifyFailure(response) };

  const body = await readJson(response);
  if (typeof body.url !== 'string' || !body.url) return { ok: false, reason: 'unavailable' };
  return { ok: true, url: body.url };
}

async function readSessionRedirect(response: Response | null): Promise<OAuthRedirect> {
  const redirect = await readRedirect(response);
  if (!redirect.ok) return redirect;

  try {
    const target = new URL(redirect.url);
    if (target.origin === new URL(DASHBOARD_ORIGIN).origin && target.pathname === '/oauth/login') {
      return { ok: false, reason: 'invalid' };
    }
  } catch {
    return redirect;
  }
  return redirect;
}

export function readSignedOAuthQuery(requestUrl: string): string | null {
  const { searchParams, search } = new URL(requestUrl);
  return searchParams.has('sig') ? search.slice(1) : null;
}

export async function signInForOAuth(
  email: string,
  password: string,
  oauthQuery: string
): Promise<{ ok: true; token: string; url: string } | { ok: false; reason: OAuthFailure }> {
  const response = await fetch(`${COLLECTOR_AUTH_URL}/sign-in/email`, {
    method: 'POST',
    headers: oauthHeaders(),
    body: JSON.stringify({ email, password, oauth_query: oauthQuery }),
  }).catch(() => null);

  const token = response?.headers.get('set-auth-token');
  const redirect = await readRedirect(response);
  if (!redirect.ok) return redirect;
  if (!token) return { ok: false, reason: 'unavailable' };
  return { ok: true, token, url: redirect.url };
}

export async function resumeAuthorize(token: string, oauthQuery: string): Promise<OAuthRedirect> {
  const params = new URLSearchParams(oauthQuery);
  SIGNATURE_QUERY_KEYS.forEach((key) => params.delete(key));

  const response = await fetch(`${COLLECTOR_AUTH_URL}/oauth2/authorize?${params.toString()}`, {
    headers: oauthHeaders(token),
  }).catch(() => null);

  return readSessionRedirect(response);
}

export async function submitConsent(token: string, accept: boolean, oauthQuery: string): Promise<OAuthRedirect> {
  const response = await fetch(`${COLLECTOR_AUTH_URL}/oauth2/consent`, {
    method: 'POST',
    headers: oauthHeaders(token),
    body: JSON.stringify({ accept, oauth_query: oauthQuery }),
  }).catch(() => null);

  return readSessionRedirect(response);
}

export async function getClientName(token: string, clientId: string): Promise<string> {
  const response = await fetch(`${COLLECTOR_AUTH_URL}/oauth2/public-client?client_id=${encodeURIComponent(clientId)}`, {
    headers: oauthHeaders(token),
  }).catch(() => null);

  const body = response?.ok ? await readJson(response) : {};
  if (typeof body.client_name === 'string' && body.client_name) return body.client_name;

  try {
    return new URL(clientId).hostname || clientId;
  } catch {
    return clientId;
  }
}
