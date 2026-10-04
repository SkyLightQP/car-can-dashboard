import { TRPCClientError } from '@trpc/client';

import { collectorClient } from '@/libs/collector-client.server';
import type { MaintenanceActionResult, MaintenanceIntent } from '@/libs/maintenance';
import type { AppRouter } from '@/types/collector';

const errorMessageByCode: Record<string, string> = {
  BAD_REQUEST: '입력값을 확인해 주세요.',
  NOT_FOUND: '이미 삭제되었거나 없는 항목입니다.',
};

const CONNECTION_ERROR_MESSAGE = '수집 서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.';

async function sendIntent(payload: MaintenanceIntent): Promise<void> {
  switch (payload.intent) {
    case 'createRecord':
      await collectorClient.maintenance.records.create.mutate(payload.record);
      return;
    case 'updateRecord':
      await collectorClient.maintenance.records.update.mutate(payload.record);
      return;
    case 'deleteRecord':
      await collectorClient.maintenance.records.delete.mutate({ id: payload.id });
      return;
    case 'updateSchedule':
      await collectorClient.maintenance.schedules.update.mutate(payload.schedule);
      return;
  }
}

function toErrorMessage(error: TRPCClientError<AppRouter>): string {
  const code = error.data?.code;
  return (code && errorMessageByCode[code]) ?? CONNECTION_ERROR_MESSAGE;
}

export async function runMaintenanceIntent(payload: MaintenanceIntent): Promise<MaintenanceActionResult> {
  try {
    await sendIntent(payload);
    return { ok: true };
  } catch (error) {
    if (!(error instanceof TRPCClientError)) throw error;
    return { ok: false, error: toErrorMessage(error as TRPCClientError<AppRouter>) };
  }
}
