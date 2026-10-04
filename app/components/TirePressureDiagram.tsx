import { Card, Chip } from '@heroui/react';

import { statusChipColor, statusLabel } from '@/libs/status';
import { cn } from '@/libs/utils';
import type { TirePosition, TireReading } from '@/types/dashboard';

const positionOrder: TirePosition[] = ['frontLeft', 'frontRight', 'rearLeft', 'rearRight'];

const tireToneByColor: Record<ReturnType<typeof statusChipColor> | 'default', string> = {
  success: 'bg-[var(--success-soft)]',
  warning: 'bg-[var(--warning-soft)]',
  danger: 'bg-[var(--danger-soft)]',
  default: 'bg-[var(--foreground)]/[0.04]',
};

function TireBadge({ reading }: { reading: TireReading }) {
  const tone = reading.status ? statusChipColor(reading.status) : 'default';

  return (
    <div
      className={cn(
        'relative flex flex-col items-center justify-center gap-1.5 rounded-3xl px-4 py-6',
        tireToneByColor[tone]
      )}
    >
      <span className="text-xs text-[var(--muted)]">{reading.label}</span>
      <span className="text-2xl font-semibold tracking-tight tabular-nums">
        {reading.pressurePsi === null ? '-' : reading.pressurePsi.toFixed(1)}
      </span>
      <span className="text-xs text-[var(--muted)]">psi · 권장 {reading.recommendedPsi}</span>
      <Chip className="mt-1" color={tone} size="sm" variant="soft">
        <Chip.Label>{reading.status ? statusLabel(reading.status) : '미수신'}</Chip.Label>
      </Chip>
    </div>
  );
}

export function TirePressureDiagram({ readings }: { readings: TireReading[] }) {
  const byPosition = new Map(readings.map((reading) => [reading.position, reading]));

  return (
    <Card className="p-6">
      <div className="relative mx-auto grid max-w-md grid-cols-2 gap-x-16 gap-y-6">
        {/* 차체 실루엣 — 4개 타이어 사이를 지나는 세로 막대 */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-4 left-1/2 w-20 -translate-x-1/2 rounded-full bg-[var(--foreground)]/[0.04]"
        />
        {positionOrder.map((position) => {
          const reading = byPosition.get(position);
          if (!reading) return null;
          return <TireBadge key={position} reading={reading} />;
        })}
      </div>
      <p className="mt-6 text-center text-xs text-[var(--muted)]">차량을 위에서 본 배치입니다</p>
    </Card>
  );
}
