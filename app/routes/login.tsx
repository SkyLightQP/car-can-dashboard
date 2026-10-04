import { Button, Card, FieldError, Form, Input, Label, TextField } from '@heroui/react';
import type { SyntheticEvent } from 'react';
import { redirect, useFetcher } from 'react-router';

import { ThemeToggle } from '@/components/theme-toggle';
import { hasSession, readToken, saveTokenCookie, signIn, type SignInResult } from '@/libs/auth.server';

import type { Route } from './+types/login';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signInErrorMessages: Record<Extract<SignInResult, { ok: false }>['reason'], string> = {
  invalid: '이메일 또는 비밀번호가 올바르지 않습니다.',
  unavailable: '수집 서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.',
};

export function meta(_: Route.MetaArgs) {
  return [{ title: '로그인 | 차량 대시보드' }];
}

export async function loader({ request }: Route.LoaderArgs) {
  const token = await readToken(request);
  const signedIn = token ? await hasSession(token).catch(() => false) : false;
  if (signedIn) throw redirect('/');
  return null;
}

export async function action({ request }: Route.ActionArgs) {
  const form = await request.formData();
  const result = await signIn(String(form.get('email') ?? ''), String(form.get('password') ?? ''));
  if (!result.ok) return { error: signInErrorMessages[result.reason] };
  throw redirect('/', { headers: { 'Set-Cookie': await saveTokenCookie(result.token) } });
}

function validateEmail(value: string): string | null {
  if (!value) return '이메일을 입력해 주세요.';
  if (!EMAIL_PATTERN.test(value)) return '올바른 이메일 형식이 아닙니다.';
  return null;
}

function validatePassword(value: string): string | null {
  return value ? null : '비밀번호를 입력해 주세요.';
}

export default function Login() {
  const fetcher = useFetcher<typeof action>();

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
          <Card.Description className="text-sm text-[var(--muted)]">계정 정보를 입력해 주세요.</Card.Description>
        </Card.Header>
        <Card.Content>
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
            {fetcher.data?.error ? (
              <p className="text-sm text-[var(--danger)]" role="alert">
                {fetcher.data.error}
              </p>
            ) : null}
            <Button className="mt-2 w-full" isPending={fetcher.state !== 'idle'} type="submit" variant="primary">
              로그인
            </Button>
          </Form>
        </Card.Content>
      </Card>
    </div>
  );
}
