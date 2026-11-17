import { Button, Card, FieldError, Form, Input, Label, TextField } from '@heroui/react';
import type { SyntheticEvent } from 'react';
import { redirect, useFetcher, useLoaderData } from 'react-router';

import { ThemeToggle } from '@/components/ThemeToggle';
import { hasSession, readToken, saveTokenCookie } from '@/libs/auth.server';
import { oauthFailureMessages, readSignedOAuthQuery, resumeAuthorize, signInForOAuth } from '@/libs/oauth.server';

import type { Route } from './+types/oauth.login';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function meta(_: Route.MetaArgs) {
  return [{ title: '로그인 | 차량 대시보드' }];
}

export function headers(_: Route.HeadersArgs) {
  return { 'X-Frame-Options': 'DENY', 'Content-Security-Policy': "frame-ancestors 'none'" };
}

export async function loader({ request }: Route.LoaderArgs) {
  const oauthQuery = readSignedOAuthQuery(request.url);
  if (!oauthQuery) throw redirect('/');

  const token = await readToken(request);
  const signedIn = token ? await hasSession(token).catch(() => false) : false;
  if (!token || !signedIn) return { error: null, expired: false };

  const resumed = await resumeAuthorize(token, oauthQuery);
  if (resumed.ok) throw redirect(resumed.url);
  if (resumed.reason === 'invalid') return { error: null, expired: false };
  return { error: oauthFailureMessages[resumed.reason], expired: resumed.reason === 'expired' };
}

export async function action({ request }: Route.ActionArgs) {
  const oauthQuery = readSignedOAuthQuery(request.url);
  if (!oauthQuery) throw redirect('/');

  const form = await request.formData();
  const result = await signInForOAuth(String(form.get('email') ?? ''), String(form.get('password') ?? ''), oauthQuery);
  if (!result.ok) return { error: oauthFailureMessages[result.reason], expired: result.reason === 'expired' };
  throw redirect(result.url, { headers: { 'Set-Cookie': await saveTokenCookie(result.token) } });
}

function validateEmail(value: string): string | null {
  if (!value) return '이메일을 입력해 주세요.';
  if (!EMAIL_PATTERN.test(value)) return '올바른 이메일 형식이 아닙니다.';
  return null;
}

function validatePassword(value: string): string | null {
  return value ? null : '비밀번호를 입력해 주세요.';
}

export default function OAuthLogin() {
  const loaderData = useLoaderData<typeof loader>();
  const fetcher = useFetcher<typeof action>();
  const { error, expired } = fetcher.data ?? loaderData;

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    void fetcher.submit(event.currentTarget, { method: 'post' });
  };

  return (
    <div className="app-canvas relative flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-sm p-6 sm:p-8">
        <Card.Header className="mb-6 flex flex-col gap-1">
          <Card.Title className="text-xl font-semibold">로그인</Card.Title>
          <Card.Description className="text-sm text-[var(--muted)]">
            AI 앱을 연결하려면 로그인해 주세요.
          </Card.Description>
        </Card.Header>
        <Card.Content>
          {expired ? (
            <p className="text-sm text-[var(--danger)]" role="alert">
              {error}
            </p>
          ) : (
            <Form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <TextField autoComplete="email" isRequired name="email" type="email" validate={validateEmail}>
                <Label>이메일</Label>
                <Input />
                <FieldError />
              </TextField>
              <TextField
                autoComplete="current-password"
                isRequired
                name="password"
                type="password"
                validate={validatePassword}
              >
                <Label>비밀번호</Label>
                <Input />
                <FieldError />
              </TextField>
              {error ? (
                <p className="text-sm text-[var(--danger)]" role="alert">
                  {error}
                </p>
              ) : null}
              <Button className="mt-2 w-full" isPending={fetcher.state !== 'idle'} type="submit" variant="primary">
                로그인
              </Button>
            </Form>
          )}
        </Card.Content>
      </Card>
    </div>
  );
}
