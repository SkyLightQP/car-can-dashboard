import { Card } from '@heroui/react';
import type { ReactNode } from 'react';

import { TrendNote } from '@/components/TrendNote';
import { cn } from '@/libs/utils';

interface ChartCardProps {
  label: string;
  /** 차트 위에 크게 얹히는 대표 값. 없으면 라벨만 나온다. */
  value?: string;
  unit?: string;
  changePct?: number;
  hint?: string;
  children: ReactNode;
  className?: string;
}

/** 참조 디자인의 "라벨 → 큰 수치 → 증감 한 줄 → 차트" 순서를 그대로 쓰는 차트 카드. */
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
