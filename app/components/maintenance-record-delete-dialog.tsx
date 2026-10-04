import { AlertDialog, Button, useOverlayState } from '@heroui/react';
import { useEffect } from 'react';
import { useFetcher } from 'react-router';

import type { MaintenanceActionResult, MaintenanceIntent } from '@/libs/maintenance';
import type { MaintenanceRecordView } from '@/types/collector';

export function MaintenanceRecordDeleteDialog({ record }: { record: MaintenanceRecordView }) {
  const state = useOverlayState();

  return (
    <>
      <Button onPress={state.open} size="sm" variant="tertiary">
        삭제
      </Button>
      <AlertDialog.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-[400px]">
            <DeleteConfirm onDone={state.close} record={record} />
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </>
  );
}

function DeleteConfirm({ record, onDone }: { record: MaintenanceRecordView; onDone: () => void }) {
  const fetcher = useFetcher<MaintenanceActionResult>();
  const result = fetcher.data;

  useEffect(() => {
    if (result?.ok) onDone();
  }, [result, onDone]);

  const handleDelete = () => {
    const payload: MaintenanceIntent = { intent: 'deleteRecord', id: record.id };
    void fetcher.submit(payload, { method: 'post', encType: 'application/json', action: '/maintenance' });
  };

  return (
    <>
      <AlertDialog.Header>
        <AlertDialog.Icon status="danger" />
        <AlertDialog.Heading>정비 기록을 삭제할까요?</AlertDialog.Heading>
      </AlertDialog.Header>
      <AlertDialog.Body>
        <p>
          {record.performedOn} · {record.item} 기록을 삭제합니다. 삭제하면 정비 알림도 다시 계산됩니다.
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
