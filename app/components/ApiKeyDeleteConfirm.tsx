import { AlertDialog, Button } from '@heroui/react';
import { useEffect } from 'react';
import { useFetcher } from 'react-router';

import type { ApiKeyActionResult, ApiKeyIntent } from '@/libs/api-key';
import type { ApiKeyView } from '@/types/collector';

export function ApiKeyDeleteConfirm({ apiKey, onDone }: { apiKey: ApiKeyView; onDone: () => void }) {
  const fetcher = useFetcher<ApiKeyActionResult>();
  const result = fetcher.data;

  useEffect(() => {
    if (result?.ok) onDone();
  }, [result, onDone]);

  const handleDelete = () => {
    const payload: ApiKeyIntent = { intent: 'deleteApiKey', id: apiKey.id };
    void fetcher.submit(payload, { method: 'post', encType: 'application/json', action: '/settings' });
  };

  return (
    <>
      <AlertDialog.Header>
        <AlertDialog.Icon status="danger" />
        <AlertDialog.Heading>API 키를 삭제할까요?</AlertDialog.Heading>
      </AlertDialog.Header>
      <AlertDialog.Body>
        <p>
          {apiKey.name} (<code className="font-mono">{apiKey.prefix}…</code>) 키를 삭제합니다. 이 키를 쓰는 장치는 바로
          데이터 전송을 거부당합니다.
        </p>
        {result && !result.ok ? <p className="mt-2 text-sm text-[var(--danger)]">{result.error}</p> : null}
      </AlertDialog.Body>
      <AlertDialog.Footer>
        <Button onPress={onDone} variant="tertiary">
          취소
        </Button>
        <Button isPending={fetcher.state !== 'idle'} onPress={handleDelete} variant="danger">
          삭제
        </Button>
      </AlertDialog.Footer>
    </>
  );
}
