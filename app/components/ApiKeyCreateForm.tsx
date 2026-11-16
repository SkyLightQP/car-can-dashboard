import { Button, FieldError, Input, Label, Modal, TextField } from '@heroui/react';
import { useState } from 'react';
import { useFetcher } from 'react-router';

import { ApiKeyReveal } from '@/components/ApiKeyReveal';
import { API_KEY_NAME_MAX_LENGTH, type ApiKeyActionResult, type ApiKeyIntent } from '@/libs/api-key';

export function ApiKeyCreateForm({ onDone }: { onDone: () => void }) {
  const fetcher = useFetcher<ApiKeyActionResult>();
  const [name, setName] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const result = fetcher.data;

  if (result?.ok && result.created) {
    return <ApiKeyReveal created={result.created} onDone={onDone} />;
  }

  const isNameInvalid = submitted && !name.trim();

  const handleSubmit = () => {
    setSubmitted(true);
    if (!name.trim()) return;

    const payload: ApiKeyIntent = { intent: 'createApiKey', name: name.trim() };
    void fetcher.submit(payload, { method: 'post', encType: 'application/json', action: '/settings' });
  };

  return (
    <>
      <Modal.Header>
        <Modal.Heading>API 키 생성</Modal.Heading>
      </Modal.Header>
      <Modal.Body>
        <div className="flex flex-col gap-4">
          <TextField
            isInvalid={isNameInvalid}
            isRequired
            maxLength={API_KEY_NAME_MAX_LENGTH}
            onChange={setName}
            value={name}
          >
            <Label>이름</Label>
            <Input placeholder="예: 차량 ESP32" />
            <FieldError>어느 장치에서 쓰는 키인지 이름을 입력해 주세요.</FieldError>
          </TextField>
          {result && !result.ok ? <p className="text-sm text-[var(--danger)]">{result.error}</p> : null}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onPress={onDone} variant="tertiary">
          취소
        </Button>
        <Button isPending={fetcher.state !== 'idle'} onPress={handleSubmit} variant="primary">
          생성
        </Button>
      </Modal.Footer>
    </>
  );
}
