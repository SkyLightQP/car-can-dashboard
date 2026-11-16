import { AlertDialog, Button, useOverlayState } from '@heroui/react';

import { ApiKeyDeleteConfirm } from '@/components/ApiKeyDeleteConfirm';
import type { ApiKeyView } from '@/types/collector';

export function ApiKeyDeleteDialog({ apiKey }: { apiKey: ApiKeyView }) {
  const state = useOverlayState();

  return (
    <>
      <Button
        className="h-8 min-w-0 px-2.5 text-xs text-[var(--muted)] hover:text-[var(--danger)]"
        onPress={state.open}
        size="sm"
        variant="ghost"
      >
        삭제
      </Button>
      <AlertDialog.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-[400px]">
            <ApiKeyDeleteConfirm apiKey={apiKey} onDone={state.close} />
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </>
  );
}
