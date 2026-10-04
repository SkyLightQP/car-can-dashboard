import { Button } from '@heroui/react';
import { Form } from 'react-router';

import { LogoutIcon } from '@/components/icons';

export function LogoutButton({ variant }: { variant: 'rail' | 'list' }) {
  if (variant === 'rail') {
    return (
      <Form action="/logout" method="post">
        <Button
          aria-label="로그아웃"
          className="size-11 rounded-full bg-[var(--rail-surface)] text-[var(--muted)] shadow-[var(--surface-shadow)] hover:text-[var(--foreground)]"
          isIconOnly
          type="submit"
          variant="tertiary"
        >
          <LogoutIcon className="size-5" />
        </Button>
      </Form>
    );
  }

  return (
    <Form action="/logout" method="post">
      <button
        className="flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium text-[var(--muted)] transition-colors hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]"
        type="submit"
      >
        <LogoutIcon className="size-5 shrink-0" />
        로그아웃
      </button>
    </Form>
  );
}
