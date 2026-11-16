import { ApiKeyDeleteDialog } from '@/components/ApiKeyDeleteDialog';
import { formatKstDate } from '@/libs/datetime';
import type { ApiKeyView } from '@/types/collector';

export function ApiKeyRow({ apiKey }: { apiKey: ApiKeyView }) {
  return (
    <div className="flex h-16 items-center gap-4 pr-2 pl-4 sm:pl-5">
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm font-medium" title={apiKey.name}>
          {apiKey.name}
        </span>
        <span className="truncate text-xs text-[var(--muted)]">{formatKstDate(apiKey.createdAt)} 생성</span>
      </div>
      <div className="flex shrink-0 items-center">
        <ApiKeyDeleteDialog apiKey={apiKey} />
      </div>
    </div>
  );
}
