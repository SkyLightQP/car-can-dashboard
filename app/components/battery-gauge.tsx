import { Card, Chip, Meter } from '@heroui/react';

import { formatKstDateTime } from '@/libs/datetime';
import { statusChipColor, statusLabel } from '@/libs/status';
import type { BatteryReading } from '@/types/dashboard';

const MIN_VOLTAGE = 11.5;
const MAX_VOLTAGE = 13;

export function BatteryGauge({ reading }: { reading: BatteryReading }) {
  const measuredAt = formatKstDateTime(reading.measuredAt);
  const tone = statusChipColor(reading.status);

  return (
    <Card className="flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] text-[var(--muted)]">현재 전압</span>
          <div className="flex items-baseline gap-1.5">
            <span className="text-4xl font-semibold tracking-tight tabular-nums">{reading.voltage.toFixed(1)}</span>
            <span className="text-base text-[var(--muted)]">V</span>
          </div>
        </div>
        <Chip color={tone} size="md" variant="soft">
          <Chip.Label>{statusLabel(reading.status)}</Chip.Label>
        </Chip>
      </div>

      <Meter
        aria-label="배터리 전압"
        color={tone}
        maxValue={MAX_VOLTAGE}
        minValue={MIN_VOLTAGE}
        value={reading.voltage}
      >
        <Meter.Track>
          <Meter.Fill />
        </Meter.Track>
      </Meter>

      <div className="flex justify-between text-xs text-[var(--muted)]">
        <span className="tabular-nums">{MIN_VOLTAGE.toFixed(1)}V</span>
        <span>측정 {measuredAt}</span>
        <span className="tabular-nums">{MAX_VOLTAGE.toFixed(1)}V</span>
      </div>
    </Card>
  );
}
