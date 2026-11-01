import { DataLoadError } from '@/components/DataLoadError';
import { MaintenanceScheduleSettings } from '@/components/MaintenanceScheduleSettings';
import { PageHeader } from '@/components/PageHeader';
import { Section } from '@/components/Section';
import { collectorContext } from '@/libs/collector-client.server';
import { type MaintenanceIntent, sortByMaintenanceType } from '@/libs/maintenance';
import { runMaintenanceIntent } from '@/libs/maintenance-actions.server';

import type { Route } from './+types/settings';

export function meta(_: Route.MetaArgs) {
  return [{ title: '설정 | 차량 대시보드' }];
}

export async function loader({ context }: Route.LoaderArgs) {
  const schedules = await context.get(collectorContext).maintenance.schedules.list.query();
  return { schedules: sortByMaintenanceType(schedules) };
}

export async function action({ request, context }: Route.ActionArgs) {
  const payload = (await request.json()) as MaintenanceIntent;
  return runMaintenanceIntent(context.get(collectorContext), payload);
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
    </div>
  );
}
