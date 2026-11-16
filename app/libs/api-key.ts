import type { CreatedApiKey } from '@/types/collector';

export type ApiKeyIntent = { intent: 'createApiKey'; name: string } | { intent: 'deleteApiKey'; id: string };

export type ApiKeyActionResult = { ok: true; created: CreatedApiKey | null } | { ok: false; error: string };

export const API_KEY_NAME_MAX_LENGTH = 50;

export function isApiKeyIntent(payload: { intent: string }): payload is ApiKeyIntent {
  return payload.intent === 'createApiKey' || payload.intent === 'deleteApiKey';
}
