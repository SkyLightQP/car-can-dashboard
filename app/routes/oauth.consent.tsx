import { Button, Card } from '@heroui/react';
import { redirect, useFetcher, useLoaderData } from 'react-router';

import { ThemeToggle } from '@/components/ThemeToggle';
import { hasSession, readToken } from '@/libs/auth.server';
import { getClientName, oauthFailureMessages, readSignedOAuthQuery, submitConsent } from '@/libs/oauth.server';

import type { Route } from './+types/oauth.consent';

export function meta(_: Route.MetaArgs) {
  return [{ title: '앱 연결 허용 | 차량 대시보드' }];
}

export function headers(_: Route.HeadersArgs) {
  return { 'X-Frame-Options': 'DENY', 'Content-Security-Policy': "frame-ancestors 'none'" };
}

export async function loader({ request }: Route.LoaderArgs) {
  const oauthQuery = readSignedOAuthQuery(request.url);
  if (!oauthQuery) throw redirect('/');

  const token = await readToken(request);
  const signedIn = token ? await hasSession(token).catch(() => false) : false;
  if (!token || !signedIn) throw redirect(`/oauth/login?${oauthQuery}`);

  const clientId = new URLSearchParams(oauthQuery).get('client_id') ?? '';
  return { clientName: await getClientName(token, clientId) };
}

export async function action({ request }: Route.ActionArgs) {
  const oauthQuery = readSignedOAuthQuery(request.url);
  if (!oauthQuery) throw redirect('/');

  const token = await readToken(request);
  if (!token) throw redirect(`/oauth/login?${oauthQuery}`);

  const form = await request.formData();
  const result = await submitConsent(token, form.get('decision') === 'accept', oauthQuery);
  if (result.ok) throw redirect(result.url);
  if (result.reason === 'invalid') throw redirect(`/oauth/login?${oauthQuery}`);
  return { error: oauthFailureMessages[result.reason], expired: result.reason === 'expired' };
}

export default function OAuthConsent() {
  const { clientName } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const pendingDecision = fetcher.formData?.get('decision');

  return (
    <div className="app-canvas relative flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-sm p-6 sm:p-8">
        <Card.Header className="mb-6 flex flex-col gap-1">
          <Card.Title className="text-xl font-semibold">앱 연결 허용</Card.Title>
          <Card.Description className="text-sm text-[var(--muted)]">
            {clientName}이(가) 차량 데이터를 읽으려고 합니다.
          </Card.Description>
        </Card.Header>
        <Card.Content>
          {fetcher.data?.expired ? (
            <p className="text-sm text-[var(--danger)]" role="alert">
              {fetcher.data.error}
            </p>
          ) : (
            <fetcher.Form className="flex flex-col gap-4" method="post">
              <ul className="list-disc pl-5 text-sm">
                <li>차량 상태와 배터리</li>
                <li>주행 기록</li>
                <li>정비 알림과 이력</li>
              </ul>
              {fetcher.data?.error ? (
                <p className="text-sm text-[var(--danger)]" role="alert">
                  {fetcher.data.error}
                </p>
              ) : null}
              <div className="mt-2 flex gap-3">
                <Button
                  className="flex-1"
                  isDisabled={fetcher.state !== 'idle'}
                  name="decision"
                  type="submit"
                  value="deny"
                  variant="tertiary"
                >
                  거부
                </Button>
                <Button
                  className="flex-1"
                  isPending={fetcher.state !== 'idle' && pendingDecision === 'accept'}
                  name="decision"
                  type="submit"
                  value="accept"
                  variant="primary"
                >
                  허용
                </Button>
              </div>
            </fetcher.Form>
          )}
        </Card.Content>
      </Card>
    </div>
  );
}
