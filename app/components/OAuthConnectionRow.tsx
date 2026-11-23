import { OAuthConnectionRevokeDialog } from '@/components/OAuthConnectionRevokeDialog';
import { formatKstDate, formatKstDateTime } from '@/libs/datetime';
import { oauthConnectionName } from '@/libs/oauth-connection';
import type { OAuthConnectionView } from '@/types/collector';

export function OAuthConnectionRow({ connection }: { connection: OAuthConnectionView }) {
  const name = oauthConnectionName(connection);
  const lastUsed = connection.lastTokenIssuedAt ? formatKstDateTime(connection.lastTokenIssuedAt) : '-';

  return (
    <div className="flex min-h-16 items-center gap-4 py-3 pr-2 pl-4 sm:pl-5">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm font-medium" title={name}>
          {name}
        </span>
        <span className="flex flex-wrap gap-x-3 text-xs text-[var(--muted)]">
          <span>{formatKstDate(connection.connectedAt)} 연결</span>
          <span>최근 사용 {lastUsed}</span>
        </span>
      </div>
      <div className="flex shrink-0 items-center">
        <OAuthConnectionRevokeDialog connection={connection} />
      </div>
    </div>
  );
}
