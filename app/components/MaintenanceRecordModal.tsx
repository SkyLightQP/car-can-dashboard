import { Button, Modal, useOverlayState } from '@heroui/react';

import { PlusIcon } from '@/components/Icons';
import { MaintenanceRecordForm } from '@/components/MaintenanceRecordForm';
import type { MaintenanceRecordView } from '@/types/collector';

interface MaintenanceRecordModalProps {
  record?: MaintenanceRecordView;
  defaultOdometerKm: number | null;
}

export function MaintenanceRecordModal({ record, defaultOdometerKm }: MaintenanceRecordModalProps) {
  const state = useOverlayState();

  return (
    <Modal state={state}>
      {record ? (
        <Button size="sm" variant="tertiary">
          수정
        </Button>
      ) : (
        <Button variant="primary">
          <PlusIcon className="size-4" />
          기록 추가
        </Button>
      )}
      <Modal.Backdrop>
        <Modal.Container size="md">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <MaintenanceRecordForm defaultOdometerKm={defaultOdometerKm} onDone={state.close} record={record} />
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
