import { Card } from '@heroui/react';
import type { ReactNode } from 'react';

import { TrendNote } from '@/components/TrendNote';
import { cn } from '@/libs/utils';

interface ChartCardProps {
  label: string;
  value?: string;
  unit?: string;
  changePct?: number;
  hint?: string;
  children: ReactNode;
  className?: string;
}

export function ChartCard({ label, value, unit, changePct, hint, children, className }: ChartCardProps) {
  return (
    <Card className={cn('gap-0 p-5', className)}>
      <div className="flex flex-col gap-2">
        <span className="text-[13px] text-[var(--muted)]">{label}</span>
        {value ? (
          <div className="flex items-baseline gap-1.5">
            <span className="text-[1.75rem] font-semibold tracking-tight tabular-nums">{value}</span>
            {unit ? <span className="text-sm text-[var(--muted)]">{unit}</span> : null}
          </div>
        ) : null}
        <TrendNote changePct={changePct} note={hint} />
      </div>
      <div className="mt-4">{children}</div>
    </Card>
  );
}
