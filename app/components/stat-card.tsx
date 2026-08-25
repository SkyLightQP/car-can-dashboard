import { Card, Chip } from '@heroui/react';
import type { ReactNode } from 'react';

import { cn } from '@/libs/utils';

interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  hint?: string;
  changePct?: number;
  icon?: ReactNode;
  className?: string;
}

export function StatCard({ label, value, unit, hint, changePct, icon, className }: StatCardProps) {
  const hasChange = typeof changePct === 'number';
  const isUp = hasChange && changePct >= 0;

  return (
    <Card className={cn('p-5', className)}>
      <div className="flex items-start justify-between gap-3">
        <span className="text-[var(--foreground)]/60 text-sm">{label}</span>
        {icon ? <span className="text-[var(--foreground)]/40">{icon}</span> : null}
      </div>
      <div className="mt-3 flex items-baseline gap-1">
        <span className="text-3xl font-semibold tabular-nums">{value}</span>
        {unit ? <span className="text-[var(--foreground)]/60 text-sm">{unit}</span> : null}
      </div>
      {hasChange || hint ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {hasChange ? (
            <Chip color={isUp ? 'success' : 'danger'} size="sm" variant="soft">
              <Chip.Label>{`${isUp ? '+' : ''}${changePct.toFixed(1)}%`}</Chip.Label>
            </Chip>
          ) : null}
          {hint ? <span className="text-[var(--foreground)]/50 text-xs">{hint}</span> : null}
        </div>
      ) : null}
    </Card>
  );
}
