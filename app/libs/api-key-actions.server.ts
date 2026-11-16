import type { ApiKeyActionResult, ApiKeyIntent } from '@/libs/api-key';
import type { CollectorClient } from '@/libs/collector-client.server';
import { toCollectorErrorMessage } from '@/libs/collector-error.server';

export async function runApiKeyIntent(collector: CollectorClient, payload: ApiKeyIntent): Promise<ApiKeyActionResult> {
  try {
    if (payload.intent === 'createApiKey') {
      return { ok: true, created: await collector.apiKeys.create.mutate({ name: payload.name }) };
    }
    await collector.apiKeys.delete.mutate({ id: payload.id });
    return { ok: true, created: null };
  } catch (error) {
    return { ok: false, error: toCollectorErrorMessage(error) };
  }
}
