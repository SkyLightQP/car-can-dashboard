import { AlertDialog, Button, useOverlayState } from '@heroui/react';

import { OAuthConnectionRevokeConfirm } from '@/components/OAuthConnectionRevokeConfirm';
import type { OAuthConnectionView } from '@/types/collector';

export function OAuthConnectionRevokeDialog({ connection }: { connection: OAuthConnectionView }) {
  const state = useOverlayState();

  return (
    <>
      <Button
        className="h-8 min-w-0 px-2.5 text-xs text-[var(--muted)] hover:text-[var(--danger)]"
        onPress={state.open}
        size="sm"
        variant="ghost"
      >
        권한 취소
      </Button>
      <AlertDialog.Backdrop isOpen={state.isOpen} onOpenChange={state.setOpen}>
        <AlertDialog.Container>
          <AlertDialog.Dialog className="sm:max-w-[400px]">
            <OAuthConnectionRevokeConfirm connection={connection} onDone={state.close} />
          </AlertDialog.Dialog>
        </AlertDialog.Container>
      </AlertDialog.Backdrop>
    </>
  );
}
