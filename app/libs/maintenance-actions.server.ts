import { TRPCClientError } from '@trpc/client';

import type { CollectorClient } from '@/libs/collector-client.server';
import type { MaintenanceActionResult, MaintenanceIntent } from '@/libs/maintenance';
import type { AppRouter } from '@/types/collector';

const errorMessageByCode: Record<string, string> = {
  BAD_REQUEST: '입력값을 확인해 주세요.',
  NOT_FOUND: '이미 삭제되었거나 없는 항목입니다.',
  UNAUTHORIZED: '로그인이 만료되었습니다. 다시 로그인해 주세요.',
};

const CONNECTION_ERROR_MESSAGE = '수집 서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.';

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

function toErrorMessage(error: TRPCClientError<AppRouter>): string {
  const code = error.data?.code;
  return (code && errorMessageByCode[code]) ?? CONNECTION_ERROR_MESSAGE;
}

export async function runMaintenanceIntent(
  collector: CollectorClient,
  payload: MaintenanceIntent
): Promise<MaintenanceActionResult> {
  try {
    await sendIntent(collector, payload);
    return { ok: true };
  } catch (error) {
    if (!(error instanceof TRPCClientError)) throw error;
    return { ok: false, error: toErrorMessage(error as TRPCClientError<AppRouter>) };
  }
}
