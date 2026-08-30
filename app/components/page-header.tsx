import type { ReactNode } from 'react';

import { cn } from '@/libs/utils';

interface PageHeaderProps {
  /** 제목 위에 작게 얹히는 한 줄(날짜 등). */
  eyebrow?: string;
  title: string;
  description?: string;
  /** 오른쪽 정렬되는 알약형 컨트롤들. */
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({ eyebrow, title, description, actions, className }: PageHeaderProps) {
  return (
    <header className={cn('flex flex-wrap items-end justify-between gap-4 px-1', className)}>
      <div className="flex min-w-0 flex-col gap-1">
        {eyebrow ? <span className="text-xs font-medium text-[var(--muted)]">{eyebrow}</span> : null}
        <h1 className="text-2xl font-semibold tracking-tight sm:text-[1.75rem]">{title}</h1>
        {description ? <p className="text-sm text-[var(--muted)]">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

/** 헤더 오른쪽에 놓이는 읽기 전용 정보 알약. */
export function HeaderPill({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <span className="flex h-9 items-center gap-2 rounded-full bg-[var(--surface)] px-3.5 text-xs font-medium text-[var(--muted)] shadow-[var(--surface-shadow)]">
      {icon}
      {children}
    </span>
  );
}
