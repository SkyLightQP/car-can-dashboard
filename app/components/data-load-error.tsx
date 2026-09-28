import { Card } from '@heroui/react';

import { PageHeader } from '@/components/page-header';

export function DataLoadError({ title }: { title: string }) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader eyebrow="데이터를 불러오지 못했습니다" title={title} />
      <Card className="p-6 text-sm text-[var(--muted)]">
        수집 서버에 연결할 수 없습니다. 잠시 후 다시 시도해 주세요.
      </Card>
    </div>
  );
}
