import { Button, Modal } from '@heroui/react';
import { useState } from 'react';

import type { CreatedApiKey } from '@/types/collector';

export function ApiKeyReveal({ created, onDone }: { created: CreatedApiKey; onDone: () => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(created.key);
    setCopied(true);
  };

  return (
    <>
      <Modal.Header>
        <Modal.Heading>{created.name} 키를 만들었습니다</Modal.Heading>
      </Modal.Header>
      <Modal.Body>
        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-[var(--warning)]">
            이 창을 닫으면 키를 다시 볼 수 없습니다. 지금 복사해서 장치 설정에 넣어 주세요.
          </p>
          <code className="rounded-lg bg-[var(--surface-secondary)] p-3 font-mono text-sm break-all select-all">
            {created.key}
          </code>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onPress={() => void handleCopy()} variant="secondary">
          {copied ? '복사됨' : '복사'}
        </Button>
        <Button onPress={onDone} variant="primary">
          완료
        </Button>
      </Modal.Footer>
    </>
  );
}
