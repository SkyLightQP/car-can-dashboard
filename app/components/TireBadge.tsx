import { Chip } from '@heroui/react';

import { statusChipColor, statusLabel } from '@/libs/status';
import { cn } from '@/libs/utils';
import type { TireReading } from '@/types/dashboard';

const tireToneByColor: Record<ReturnType<typeof statusChipColor> | 'default', string> = {
  success: 'bg-[var(--success-soft)]',
  warning: 'bg-[var(--warning-soft)]',
  danger: 'bg-[var(--danger-soft)]',
  default: 'bg-[var(--foreground)]/[0.04]',
};

export function TireBadge({ reading }: { reading: TireReading }) {
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
