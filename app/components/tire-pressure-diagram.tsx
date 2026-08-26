import { Card, Chip } from '@heroui/react';

import { statusChipColor, statusLabel } from '@/libs/status';
import { cn } from '@/libs/utils';
import type { TirePosition, TireReading } from '@/types/dashboard';

const positionOrder: TirePosition[] = ['frontLeft', 'frontRight', 'rearLeft', 'rearRight'];

const tireBorderByColor: Record<ReturnType<typeof statusChipColor>, string> = {
  success: 'border-[var(--success)]',
  warning: 'border-[var(--warning)]',
  danger: 'border-[var(--danger)]',
};

function TireBadge({ reading }: { reading: TireReading }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-1 rounded-2xl border-2 bg-[var(--surface)] px-4 py-5',
        tireBorderByColor[statusChipColor(reading.status)]
      )}
    >
      <span className="text-xs text-[var(--foreground)]/60">{reading.label}</span>
      <span className="text-2xl font-semibold tabular-nums">{reading.pressurePsi.toFixed(1)}</span>
      <span className="text-xs text-[var(--foreground)]/50">psi · 권장 {reading.recommendedPsi}</span>
      <Chip color={statusChipColor(reading.status)} size="sm" variant="soft">
        <Chip.Label>{statusLabel(reading.status)}</Chip.Label>
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
          className="pointer-events-none absolute inset-y-4 left-1/2 w-20 -translate-x-1/2 rounded-[2.5rem] border border-dashed border-[var(--border)] bg-[var(--foreground)]/[0.03]"
        />
        {positionOrder.map((position) => {
          const reading = byPosition.get(position);
          if (!reading) return null;
          return <TireBadge key={position} reading={reading} />;
        })}
      </div>
      <p className="mt-6 text-center text-xs text-[var(--foreground)]/50">차량을 위에서 본 배치입니다</p>
    </Card>
  );
}
