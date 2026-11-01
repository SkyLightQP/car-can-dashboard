import { Card } from '@heroui/react';

import { DataLoadError } from '@/components/DataLoadError';
import { MaintenanceAlertList } from '@/components/MaintenanceAlertList';
import { MaintenanceRecordList } from '@/components/MaintenanceRecordList';
import { MaintenanceRecordModal } from '@/components/MaintenanceRecordModal';
import { PageHeader } from '@/components/PageHeader';
import { Section } from '@/components/Section';
import { collectorContext } from '@/libs/collector-client.server';
import { formatKm, type MaintenanceIntent, toMaintenanceAlerts } from '@/libs/maintenance';
import { runMaintenanceIntent } from '@/libs/maintenance-actions.server';

import type { Route } from './+types/maintenance';

export function meta(_: Route.MetaArgs) {
  return [{ title: '정비 | 차량 대시보드' }];
}

export async function loader({ context }: Route.LoaderArgs) {
  const collector = context.get(collectorContext);
  const [alerts, records] = await Promise.all([
    collector.maintenance.alerts.query(),
    collector.maintenance.records.list.query(),
  ]);

  return {
    currentOdometerKm: alerts.currentOdometerKm,
    alerts: toMaintenanceAlerts(alerts),
    records,
  };
}

export async function action({ request, context }: Route.ActionArgs) {
  const payload = (await request.json()) as MaintenanceIntent;
  return runMaintenanceIntent(context.get(collectorContext), payload);
}

export function ErrorBoundary() {
  return <DataLoadError title="정비" />;
}

export default function Maintenance({ loaderData }: Route.ComponentProps) {
  const { currentOdometerKm, alerts, records } = loaderData;

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

      <Section description={records.length > 0 ? `${records.length}건` : undefined} title="정비 이력">
        {records.length === 0 ? (
          <Card className="p-6 text-sm text-[var(--muted)]">아직 등록된 정비 이력이 없습니다.</Card>
        ) : (
          <MaintenanceRecordList defaultOdometerKm={currentOdometerKm} records={records} />
        )}
      </Section>
    </div>
  );
}
