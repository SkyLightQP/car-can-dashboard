import type { CollectorClient } from '@/libs/collector-client.server';
import { toCollectorErrorMessage } from '@/libs/collector-error.server';
import type { OAuthConnectionActionResult, OAuthConnectionIntent } from '@/libs/oauth-connection';

export async function runOAuthConnectionIntent(
  collector: CollectorClient,
  payload: OAuthConnectionIntent
): Promise<OAuthConnectionActionResult> {
  try {
    await collector.oauthConnections.revoke.mutate({ id: payload.id });
    return { ok: true };
  } catch (error) {
    return { ok: false, error: toCollectorErrorMessage(error) };
  }
}
