import { ApiKeyCreateModal } from '@/components/ApiKeyCreateModal';
import { ApiKeySettings } from '@/components/ApiKeySettings';
import { DataLoadError } from '@/components/DataLoadError';
import { MaintenanceScheduleSettings } from '@/components/MaintenanceScheduleSettings';
import { OAuthConnectionSettings } from '@/components/OAuthConnectionSettings';
import { PageHeader } from '@/components/PageHeader';
import { Section } from '@/components/Section';
import { type ApiKeyIntent, isApiKeyIntent } from '@/libs/api-key';
import { runApiKeyIntent } from '@/libs/api-key-actions.server';
import { collectorContext } from '@/libs/collector-client.server';
import { type MaintenanceIntent, sortByMaintenanceType } from '@/libs/maintenance';
import { runMaintenanceIntent } from '@/libs/maintenance-actions.server';
import { isOAuthConnectionIntent, type OAuthConnectionIntent } from '@/libs/oauth-connection';
import { runOAuthConnectionIntent } from '@/libs/oauth-connection-actions.server';

import type { Route } from './+types/settings';

export function meta(_: Route.MetaArgs) {
  return [{ title: '설정 | 차량 대시보드' }];
}

export async function loader({ context }: Route.LoaderArgs) {
  const collector = context.get(collectorContext);
  const [schedules, apiKeys, oauthConnections] = await Promise.all([
    collector.maintenance.schedules.list.query(),
    collector.apiKeys.list.query(),
    collector.oauthConnections.list.query(),
  ]);
  return { schedules: sortByMaintenanceType(schedules), apiKeys, oauthConnections };
}

export async function action({ request, context }: Route.ActionArgs) {
  const payload = (await request.json()) as MaintenanceIntent | ApiKeyIntent | OAuthConnectionIntent;
  const collector = context.get(collectorContext);
  if (isApiKeyIntent(payload)) return runApiKeyIntent(collector, payload);
  if (isOAuthConnectionIntent(payload)) return runOAuthConnectionIntent(collector, payload);
  return runMaintenanceIntent(collector, payload);
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

      <Section action={<ApiKeyCreateModal />} title="API 키">
        <ApiKeySettings apiKeys={loaderData.apiKeys} />
      </Section>

      <Section title="연결된 앱">
        <OAuthConnectionSettings connections={loaderData.oauthConnections} />
      </Section>
    </div>
  );
}
