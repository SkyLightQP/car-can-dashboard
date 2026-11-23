import { AlertDialog, Button } from '@heroui/react';
import { useEffect } from 'react';
import { useFetcher } from 'react-router';

import {
  oauthConnectionName,
  type OAuthConnectionActionResult,
  type OAuthConnectionIntent,
} from '@/libs/oauth-connection';
import type { OAuthConnectionView } from '@/types/collector';

export function OAuthConnectionRevokeConfirm({
  connection,
  onDone,
}: {
  connection: OAuthConnectionView;
  onDone: () => void;
}) {
  const fetcher = useFetcher<OAuthConnectionActionResult>();
  const result = fetcher.data;

  useEffect(() => {
    if (result?.ok) onDone();
  }, [result, onDone]);

  const handleRevoke = () => {
    const payload: OAuthConnectionIntent = { intent: 'revokeOAuthConnection', id: connection.id };
    void fetcher.submit(payload, { method: 'post', encType: 'application/json', action: '/settings' });
  };

  return (
    <>
      <AlertDialog.Header>
        <AlertDialog.Icon status="danger" />
        <AlertDialog.Heading>앱 권한을 취소할까요?</AlertDialog.Heading>
      </AlertDialog.Header>
      <AlertDialog.Body>
        <p>{oauthConnectionName(connection)} 앱의 권한을 취소합니다.</p>
        <p className="mt-2 text-sm text-[var(--muted)]">
          다시 연결하려면 그 앱에서 로그인과 동의를 처음부터 다시 해야 합니다.
        </p>
        {result && !result.ok ? <p className="mt-2 text-sm text-[var(--danger)]">{result.error}</p> : null}
      </AlertDialog.Body>
      <AlertDialog.Footer>
        <Button onPress={onDone} variant="tertiary">
          닫기
        </Button>
        <Button isPending={fetcher.state !== 'idle'} onPress={handleRevoke} variant="danger">
          권한 취소
        </Button>
      </AlertDialog.Footer>
    </>
  );
}
