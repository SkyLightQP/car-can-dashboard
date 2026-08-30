import { Card } from '@heroui/react';

import { MaintenanceAlertList } from '@/components/maintenance-alert-list';
import { MaintenanceFormModal } from '@/components/maintenance-form-modal';
import { PageHeader } from '@/components/page-header';
import { Section } from '@/components/section';
import { useMaintenance } from '@/contexts/maintenance-context';

import type { Route } from './+types/maintenance';

export function meta(_: Route.MetaArgs) {
  return [{ title: '정비 | 차량 대시보드' }];
}

export default function Maintenance() {
  const { records, alerts } = useMaintenance();
  const sortedRecords = [...records].sort((a, b) => b.performedOn.localeCompare(a.performedOn));

  return (
    <div className="flex flex-col gap-6">
      <PageHeader actions={<MaintenanceFormModal />} eyebrow="예정 알림과 정비 이력" title="정비" />

      <Section description="정비 이력과 현재 주행거리 기준" title="정비 알림">
        <MaintenanceAlertList alerts={alerts} />
      </Section>

      <Section description="최신순" title="정비 이력">
        <ul className="flex flex-col gap-2.5">
          {sortedRecords.map((record) => (
            <li key={record.id}>
              <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-sm font-medium">{record.item}</span>
                  <span className="text-xs text-[var(--muted)]">
                    {record.performedOn} · {record.odometerKm.toLocaleString('ko-KR')} km
                  </span>
                  {record.note ? <span className="text-xs text-[var(--muted)]">{record.note}</span> : null}
                </div>
                <span className="shrink-0 rounded-full bg-[var(--foreground)]/[0.04] px-3 py-1.5 text-sm font-semibold tabular-nums">
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
