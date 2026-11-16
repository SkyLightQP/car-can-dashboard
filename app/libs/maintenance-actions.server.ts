import type { CollectorClient } from '@/libs/collector-client.server';
import { toCollectorErrorMessage } from '@/libs/collector-error.server';
import type { MaintenanceActionResult, MaintenanceIntent } from '@/libs/maintenance';

async function sendIntent(collector: CollectorClient, payload: MaintenanceIntent): Promise<void> {
  switch (payload.intent) {
    case 'createRecord':
      await collector.maintenance.records.create.mutate(payload.record);
      return;
    case 'updateRecord':
      await collector.maintenance.records.update.mutate(payload.record);
      return;
    case 'deleteRecord':
      await collector.maintenance.records.delete.mutate({ id: payload.id });
      return;
    case 'updateSchedule':
      await collector.maintenance.schedules.update.mutate(payload.schedule);
      return;
  }
}

export async function runMaintenanceIntent(
  collector: CollectorClient,
  payload: MaintenanceIntent
): Promise<MaintenanceActionResult> {
  try {
    await sendIntent(collector, payload);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: toCollectorErrorMessage(error) };
  }
}
