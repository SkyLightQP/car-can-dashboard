import type { OAuthConnectionView } from '@/types/collector';

export type OAuthConnectionIntent = { intent: 'revokeOAuthConnection'; id: string };

export type OAuthConnectionActionResult = { ok: true } | { ok: false; error: string };

export function isOAuthConnectionIntent(payload: { intent: string }): payload is OAuthConnectionIntent {
  return payload.intent === 'revokeOAuthConnection';
}

export function oauthConnectionName(connection: OAuthConnectionView): string {
  if (connection.clientName) return connection.clientName;
  return URL.canParse(connection.clientId) ? new URL(connection.clientId).hostname : connection.clientId;
}
