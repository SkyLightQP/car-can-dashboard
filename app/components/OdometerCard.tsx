import { Card } from '@heroui/react';

import { CarIcon, RouteIcon, WrenchIcon } from '@/components/Icons';
import { PillLink } from '@/components/PillLink';
import { TrendNote } from '@/components/TrendNote';
import { cn } from '@/libs/utils';

interface OdometerCardProps {
  model: string;
  odometerKm: number | null;
  distanceChangePct: number | null;
  className?: string;
}

function distanceTrendNote(changePct: number | null): string {
  if (changePct === null) return '직전 7일과 비교할 주행 기록이 없습니다';
  return changePct >= 0 ? '직전 7일 대비 주행량이 늘었습니다' : '직전 7일 대비 주행량이 줄었습니다';
}

export function OdometerCard({ model, odometerKm, distanceChangePct, className }: OdometerCardProps) {
  return (
    <Card className={cn('gap-0 p-6', className)}>
      <div className="flex items-start justify-between gap-3">
        <span className="text-[13px] text-[var(--muted)]">총 주행거리</span>
        <span className="text-xs font-medium text-[var(--muted)]">{model}</span>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl">
          {odometerKm === null ? '-' : Math.round(odometerKm).toLocaleString('ko-KR')}
        </span>
        <span className="text-base text-[var(--muted)]">km</span>
      </div>

      <TrendNote
        changePct={distanceChangePct ?? undefined}
        className="mt-3"
        note={distanceTrendNote(distanceChangePct)}
      />

      <div className="mt-6 flex flex-wrap gap-2">
        <PillLink to="/vehicle">
          <CarIcon className="size-4" />
          차량 상태
        </PillLink>
        <PillLink to="/trips">
          <RouteIcon className="size-4" />
          주행 기록
        </PillLink>
        <PillLink to="/maintenance">
          <WrenchIcon className="size-4" />
          정비
        </PillLink>
      </div>
    </Card>
  );
}
