import { Card, Chip } from '@heroui/react';

export function MissingBatteryGauge() {
  return (
    <Card className="flex flex-col gap-6 p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <span className="text-[13px] text-[var(--muted)]">현재 전압</span>
          <span className="text-4xl font-semibold tracking-tight">-</span>
        </div>
        <Chip color="default" size="md" variant="soft">
          <Chip.Label>미수신</Chip.Label>
        </Chip>
      </div>
      <p className="text-xs text-[var(--muted)]">아직 수신된 배터리 전압이 없습니다.</p>
    </Card>
  );
}
