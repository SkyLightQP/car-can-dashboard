import { Card, Chip } from '@heroui/react';

import { AlertIcon } from '@/components/icons';
import { compareByStatus, statusChipColor, statusLabel } from '@/libs/status';
import type { MaintenanceAlert } from '@/types/dashboard';

interface MaintenanceAlertListProps {
  alerts: MaintenanceAlert[];
  limit?: number;
}

export function MaintenanceAlertList({ alerts, limit }: MaintenanceAlertListProps) {
  const visible = typeof limit === 'number' ? [...alerts].sort(compareByStatus).slice(0, limit) : alerts;

  return (
    <ul className="flex flex-col gap-3">
      {visible.map((alert) => (
        <li key={alert.id}>
          <Card className="flex flex-row items-center gap-4 p-4">
            <AlertIcon className="size-5 shrink-0 text-[var(--foreground)]/40" />
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="truncate text-sm font-medium">{alert.item}</span>
              <span className="text-xs text-[var(--foreground)]/60">{alert.dueDescription}</span>
            </div>
            <Chip color={statusChipColor(alert.status)} size="sm" variant="soft">
              <Chip.Label>{statusLabel(alert.status)}</Chip.Label>
            </Chip>
          </Card>
        </li>
      ))}
    </ul>
  );
}
