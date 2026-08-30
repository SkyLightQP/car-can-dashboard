import { Card, Chip } from '@heroui/react';

import { AlertIcon } from '@/components/icons';
import { compareByStatus, statusChipColor, statusLabel } from '@/libs/status';
import { cn } from '@/libs/utils';
import type { MaintenanceAlert, StatusLevel } from '@/types/dashboard';

interface MaintenanceAlertListProps {
  alerts: MaintenanceAlert[];
  limit?: number;
}

const iconToneByStatus: Record<StatusLevel, string> = {
  critical: 'bg-[var(--danger-soft)] text-[var(--danger-soft-foreground)]',
  warning: 'bg-[var(--warning-soft)] text-[var(--warning-soft-foreground)]',
  normal: 'bg-[var(--foreground)]/[0.05] text-[var(--muted)]',
};

export function MaintenanceAlertList({ alerts, limit }: MaintenanceAlertListProps) {
  const visible = typeof limit === 'number' ? [...alerts].sort(compareByStatus).slice(0, limit) : alerts;

  return (
    <ul className="flex flex-col gap-2.5">
      {visible.map((alert) => (
        <li key={alert.id}>
          <Card className="flex flex-row items-center gap-3.5 p-4">
            <span
              className={cn(
                'flex size-9 shrink-0 items-center justify-center rounded-full',
                iconToneByStatus[alert.status]
              )}
            >
              <AlertIcon className="size-4.5" />
            </span>
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="truncate text-sm font-medium">{alert.item}</span>
              <span className="truncate text-xs text-[var(--muted)]">{alert.dueDescription}</span>
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
