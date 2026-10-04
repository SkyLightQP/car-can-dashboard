import { Card } from '@heroui/react';

import { DataLoadError } from '@/components/data-load-error';
import { MaintenanceAlertList } from '@/components/maintenance-alert-list';
import { MaintenanceRecordDeleteDialog } from '@/components/maintenance-record-delete-dialog';
import { MaintenanceRecordModal } from '@/components/maintenance-record-modal';
import { MaintenanceScheduleSettings } from '@/components/maintenance-schedule-settings';
import { PageHeader } from '@/components/page-header';
import { Section } from '@/components/section';
import { collectorClient } from '@/libs/collector-client.server';
import {
  formatKm,
  type MaintenanceIntent,
  maintenanceTypeLabels,
  sortByMaintenanceType,
  toMaintenanceAlerts,
} from '@/libs/maintenance';
import { runMaintenanceIntent } from '@/libs/maintenance-actions.server';

import type { Route } from './+types/maintenance';

export function meta(_: Route.MetaArgs) {
  return [{ title: '정비 | 차량 대시보드' }];
}

export async function loader() {
  const [alerts, records, schedules] = await Promise.all([
    collectorClient.maintenance.alerts.query(),
    collectorClient.maintenance.records.list.query(),
    collectorClient.maintenance.schedules.list.query(),
  ]);

  return {
    currentOdometerKm: alerts.currentOdometerKm,
    alerts: toMaintenanceAlerts(alerts),
    records,
    schedules: sortByMaintenanceType(schedules),
  };
}

export async function action({ request }: Route.ActionArgs) {
  const payload = (await request.json()) as MaintenanceIntent;
  return runMaintenanceIntent(payload);
}

export function ErrorBoundary() {
  return <DataLoadError title="정비" />;
}

export default function Maintenance({ loaderData }: Route.ComponentProps) {
  const { currentOdometerKm, alerts, records, schedules } = loaderData;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        actions={<MaintenanceRecordModal defaultOdometerKm={currentOdometerKm} />}
        eyebrow="예정 알림과 정비 이력"
        title="정비"
      />

      <Section
        description={
          currentOdometerKm === null
            ? '현재 주행거리 미수신'
            : `정비 이력과 현재 주행거리(${formatKm(currentOdometerKm)}) 기준`
        }
        title="정비 알림"
      >
        <MaintenanceAlertList alerts={alerts} />
      </Section>

      <Section description="최신순" title="정비 이력">
        {records.length === 0 ? (
          <Card className="p-6 text-sm text-[var(--muted)]">아직 등록된 정비 이력이 없습니다.</Card>
        ) : (
          <ul className="flex flex-col gap-2.5">
            {records.map((record) => (
              <li key={record.id}>
                <Card className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 flex-col gap-0.5">
                    <span className="text-sm font-medium">{record.item}</span>
                    <span className="text-xs text-[var(--muted)]">
                      {maintenanceTypeLabels[record.type]} · {record.performedOn} · {formatKm(record.odometerKm)}
                    </span>
                    {record.note ? <span className="text-xs text-[var(--muted)]">{record.note}</span> : null}
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="rounded-full bg-[var(--foreground)]/[0.04] px-3 py-1.5 text-sm font-semibold tabular-nums">
                      {record.costKrw.toLocaleString('ko-KR')}원
                    </span>
                    <MaintenanceRecordModal defaultOdometerKm={currentOdometerKm} record={record} />
                    <MaintenanceRecordDeleteDialog record={record} />
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section description="타입별 권장 주기와 주의 구간" title="정비 주기 설정">
        <MaintenanceScheduleSettings schedules={schedules} />
      </Section>
    </div>
  );
}
