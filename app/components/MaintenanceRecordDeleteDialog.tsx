import { AlertDialog, Button, useOverlayState } from '@heroui/react';

import { MaintenanceRecordDeleteConfirm } from '@/components/MaintenanceRecordDeleteConfirm';
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
            <MaintenanceRecordDeleteConfirm onDone={state.close} record={record} />
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </>
  );
}
