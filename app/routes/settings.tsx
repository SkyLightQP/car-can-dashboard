import { ApiKeyCreateModal } from '@/components/ApiKeyCreateModal';
import { ApiKeySettings } from '@/components/ApiKeySettings';
import { DataLoadError } from '@/components/DataLoadError';
import { MaintenanceScheduleSettings } from '@/components/MaintenanceScheduleSettings';
import { PageHeader } from '@/components/PageHeader';
import { Section } from '@/components/Section';
import { type ApiKeyIntent, isApiKeyIntent } from '@/libs/api-key';
import { runApiKeyIntent } from '@/libs/api-key-actions.server';
import { collectorContext } from '@/libs/collector-client.server';
import { type MaintenanceIntent, sortByMaintenanceType } from '@/libs/maintenance';
import { runMaintenanceIntent } from '@/libs/maintenance-actions.server';

import type { Route } from './+types/settings';

export function meta(_: Route.MetaArgs) {
  return [{ title: '설정 | 차량 대시보드' }];
}

export async function loader({ context }: Route.LoaderArgs) {
  const collector = context.get(collectorContext);
  const [schedules, apiKeys] = await Promise.all([
    collector.maintenance.schedules.list.query(),
    collector.apiKeys.list.query(),
  ]);
  return { schedules: sortByMaintenanceType(schedules), apiKeys };
}

export async function action({ request, context }: Route.ActionArgs) {
  const payload = (await request.json()) as MaintenanceIntent | ApiKeyIntent;
  const collector = context.get(collectorContext);
  return isApiKeyIntent(payload) ? runApiKeyIntent(collector, payload) : runMaintenanceIntent(collector, payload);
}

export function ErrorBoundary() {
  return <DataLoadError title="설정" />;
}

export default function Settings({ loaderData }: Route.ComponentProps) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="설정" />

      <Section title="정비 주기">
        <MaintenanceScheduleSettings schedules={loaderData.schedules} />
      </Section>

      <Section action={<ApiKeyCreateModal />} description="ESP32 장치 인증 (X-Api-Key 헤더)" title="API 키">
        <ApiKeySettings apiKeys={loaderData.apiKeys} />
      </Section>
    </div>
  );
}
