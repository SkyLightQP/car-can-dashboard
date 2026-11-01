import { Card } from '@heroui/react';

import { TireBadge } from '@/components/TireBadge';
import type { TirePosition, TireReading } from '@/types/dashboard';

const positionOrder: TirePosition[] = ['frontLeft', 'frontRight', 'rearLeft', 'rearRight'];

export function TirePressureDiagram({ readings }: { readings: TireReading[] }) {
  const byPosition = new Map(readings.map((reading) => [reading.position, reading]));

  return (
    <Card className="p-6">
      <div className="relative mx-auto grid max-w-md grid-cols-2 gap-x-16 gap-y-6">
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
