import { Card } from '@heroui/react';
import type { ReactNode } from 'react';

import { TrendNote } from '@/components/TrendNote';
import { cn } from '@/libs/utils';

interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  hint?: string;
  changePct?: number;
  icon?: ReactNode;
  /** 값을 더 크게 — 페이지의 대표 지표에만 쓴다. */
  size?: 'md' | 'lg';
  className?: string;
}

export function StatCard({ label, value, unit, hint, changePct, icon, size = 'md', className }: StatCardProps) {
  return (
    <Card className={cn('gap-0 p-5', className)}>
      <div className="flex items-start justify-between gap-3">
        <span className="text-[13px] text-[var(--muted)]">{label}</span>
        {icon ? (
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--foreground)]/[0.05] text-[var(--muted)]">
            {icon}
          </span>
        ) : null}
      </div>

      <div className="mt-2.5 flex items-baseline gap-1.5">
        <span
          className={cn(
            'font-semibold tracking-tight tabular-nums',
            size === 'lg' ? 'text-4xl sm:text-[2.75rem]' : 'text-[1.75rem]'
          )}
        >
          {value}
        </span>
        {unit ? <span className="text-sm text-[var(--muted)]">{unit}</span> : null}
      </div>

      <TrendNote changePct={changePct} className="mt-3" note={hint} />
    </Card>
  );
}
