import { Button, Input, Label, Modal, TextArea, TextField, useOverlayState } from '@heroui/react';
import { useState } from 'react';

import { PlusIcon } from '@/components/icons';
import { useMaintenance } from '@/contexts/maintenance-context';

interface FormState {
  item: string;
  performedOn: string;
  odometerKm: string;
  costKrw: string;
  note: string;
}

const emptyForm: FormState = {
  item: '',
  performedOn: '',
  odometerKm: '',
  costKrw: '',
  note: '',
};

export function MaintenanceFormModal() {
  const state = useOverlayState();
  const { addRecord } = useMaintenance();
  const [form, setForm] = useState<FormState>(emptyForm);
  const [error, setError] = useState('');

  const update = (key: keyof FormState) => (value: string) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const handleSubmit = () => {
    if (!form.item.trim() || !form.performedOn.trim()) {
      setError('정비 항목과 정비 일자는 필수입니다.');
      return;
    }

    addRecord({
      item: form.item.trim(),
      performedOn: form.performedOn.trim(),
      odometerKm: Number(form.odometerKm) || 0,
      costKrw: Number(form.costKrw) || 0,
      note: form.note.trim(),
    });

    setForm(emptyForm);
    setError('');
    state.close();
  };

  return (
    <Modal state={state}>
      <Button variant="primary">
        <PlusIcon className="size-4" />
        기록 추가
      </Button>
      <Modal.Backdrop>
        <Modal.Container size="md">
          <Modal.Dialog>
            <Modal.CloseTrigger />
            <Modal.Header>
              <Modal.Heading>정비 기록 추가</Modal.Heading>
            </Modal.Header>
            <Modal.Body>
              <div className="flex flex-col gap-4">
                <TextField isRequired onChange={update('item')} value={form.item}>
                  <Label>정비 항목</Label>
                  <Input placeholder="예: 엔진오일 교환" />
                </TextField>
                <TextField isRequired onChange={update('performedOn')} value={form.performedOn}>
                  <Label>정비 일자</Label>
                  <Input type="date" />
                </TextField>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <TextField onChange={update('odometerKm')} value={form.odometerKm}>
                    <Label>주행거리 (km)</Label>
                    <Input inputMode="numeric" placeholder="48213" />
                  </TextField>
                  <TextField onChange={update('costKrw')} value={form.costKrw}>
                    <Label>비용 (원)</Label>
                    <Input inputMode="numeric" placeholder="92000" />
                  </TextField>
                </div>
                <TextField onChange={update('note')} value={form.note}>
                  <Label>메모</Label>
                  <TextArea placeholder="정비소, 사용 부품 등" rows={3} />
                </TextField>
                {error ? <p className="text-[var(--danger)] text-sm">{error}</p> : null}
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button onPress={state.close} variant="tertiary">
                취소
              </Button>
              <Button onPress={handleSubmit} variant="primary">
                추가
              </Button>
            </Modal.Footer>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
