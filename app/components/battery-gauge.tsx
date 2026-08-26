import { Card, Chip, Meter } from '@heroui/react';

import { statusChipColor, statusLabel } from '@/libs/status';
import type { BatteryReading } from '@/types/dashboard';

const MIN_VOLTAGE = 11.5;
const MAX_VOLTAGE = 13;

export function BatteryGauge({ reading }: { reading: BatteryReading }) {
  const measuredAt = new Date(reading.measuredAt).toLocaleString('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Seoul',
  });

  return (
    <Card className="flex flex-col gap-5 p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-[var(--foreground)]/60">현재 전압</span>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-semibold tabular-nums">{reading.voltage.toFixed(1)}</span>
            <span className="text-base text-[var(--foreground)]/60">V</span>
          </div>
        </div>
        <Chip color={statusChipColor(reading.status)} size="md" variant="soft">
          <Chip.Label>{statusLabel(reading.status)}</Chip.Label>
        </Chip>
      </div>

      <Meter
        aria-label="배터리 전압"
        color={statusChipColor(reading.status)}
        maxValue={MAX_VOLTAGE}
        minValue={MIN_VOLTAGE}
        value={reading.voltage}
      >
        <Meter.Track>
          <Meter.Fill />
        </Meter.Track>
      </Meter>

      <div className="flex justify-between text-xs text-[var(--foreground)]/50">
        <span>{MIN_VOLTAGE.toFixed(1)}V</span>
        <span>측정 {measuredAt}</span>
        <span>{MAX_VOLTAGE.toFixed(1)}V</span>
      </div>
    </Card>
  );
}
