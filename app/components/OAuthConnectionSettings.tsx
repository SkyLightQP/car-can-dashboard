import { Card } from '@heroui/react';

import { OAuthConnectionRow } from '@/components/OAuthConnectionRow';
import type { OAuthConnectionView } from '@/types/collector';

export function OAuthConnectionSettings({ connections }: { connections: OAuthConnectionView[] }) {
  if (connections.length === 0) {
    return (
      <Card className="p-5">
        <p className="text-sm text-[var(--muted)]">연결된 앱이 없습니다.</p>
      </Card>
    );
  }

  return (
    <Card className="p-0">
      <ul className="divide-y divide-[var(--border)]">
        {connections.map((connection) => (
          <li key={connection.id}>
            <OAuthConnectionRow connection={connection} />
          </li>
        ))}
      </ul>
    </Card>
  );
}
