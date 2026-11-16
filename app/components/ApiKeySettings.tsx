import { Card } from '@heroui/react';

import { ApiKeyRow } from '@/components/ApiKeyRow';
import type { ApiKeyView } from '@/types/collector';

export function ApiKeySettings({ apiKeys }: { apiKeys: ApiKeyView[] }) {
  if (apiKeys.length === 0) {
    return (
      <Card className="p-5">
        <p className="text-sm text-[var(--muted)]">
          등록된 키가 없습니다. 키가 없으면 장치가 데이터를 보낼 수 없으니 키를 생성해 주세요.
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-0">
      <ul className="divide-y divide-[var(--border)]">
        {apiKeys.map((apiKey) => (
          <li key={apiKey.id}>
            <ApiKeyRow apiKey={apiKey} />
          </li>
        ))}
      </ul>
    </Card>
  );
}
