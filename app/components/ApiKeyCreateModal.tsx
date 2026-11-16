import { Button, Modal, useOverlayState } from '@heroui/react';

import { ApiKeyCreateForm } from '@/components/ApiKeyCreateForm';
import { PlusIcon } from '@/components/Icons';

export function ApiKeyCreateModal() {
  const state = useOverlayState();

  return (
    <Modal state={state}>
      <Button size="sm" variant="primary">
        <PlusIcon className="size-4" />키 생성
      </Button>
      <Modal.Backdrop isDismissable={false}>
        <Modal.Container size="md">
          <Modal.Dialog>
            <ApiKeyCreateForm onDone={state.close} />
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
