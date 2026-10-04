import { Button, Card, FieldError, Form, Input, Label, TextField } from '@heroui/react';
import type { SyntheticEvent } from 'react';
import { useNavigate } from 'react-router';

import { ThemeToggle } from '@/components/theme-toggle';

import type { Route } from './+types/login';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function meta(_: Route.MetaArgs) {
  return [{ title: '로그인 | 차량 대시보드' }];
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
  const navigate = useNavigate();

  const handleSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();
    void navigate('/');
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
            <Button className="mt-2 w-full" type="submit" variant="primary">
              로그인
            </Button>
          </Form>
        </Card.Content>
      </Card>
    </div>
  );
}
