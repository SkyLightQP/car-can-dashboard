import { Card } from '@heroui/react';

import { MaintenanceAlertList } from '@/components/maintenance-alert-list';
import { MaintenanceFormModal } from '@/components/maintenance-form-modal';
import { Section } from '@/components/section';
import { useMaintenance } from '@/contexts/maintenance-context';
import { maintenanceAlerts } from '@/mocks/maintenance';

import type { Route } from './+types/maintenance';

export function meta(_: Route.MetaArgs) {
  return [{ title: '정비 | 차량 대시보드' }];
}

export default function Maintenance() {
  const { records } = useMaintenance();

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">정비</h1>
        <p className="text-[var(--foreground)]/60 text-sm">예정 알림과 정비 이력</p>
      </header>

      <Section description="주행거리와 일자 기준" title="정비 알림">
        <MaintenanceAlertList alerts={maintenanceAlerts} />
      </Section>

      <Section action={<MaintenanceFormModal />} description="최신순" title="정비 이력">
        <ul className="flex flex-col gap-3">
          {records.map((record) => (
            <li key={record.id}>
              <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 flex-col gap-1">
                  <span className="font-medium">{record.item}</span>
                  <span className="text-[var(--foreground)]/60 text-xs">
                    {record.performedOn} · {record.odometerKm.toLocaleString('ko-KR')} km
                  </span>
                  {record.note ? <span className="text-[var(--foreground)]/50 text-xs">{record.note}</span> : null}
                </div>
                <span className="shrink-0 text-sm font-semibold tabular-nums">
                  {record.costKrw.toLocaleString('ko-KR')}원
                </span>
              </Card>
            </li>
          ))}
        </ul>
      </Section>
    </div>
  );
}
