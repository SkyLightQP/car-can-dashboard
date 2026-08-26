import {
  Button,
  FieldError,
  Input,
  Label,
  Modal,
  NumberField,
  TextArea,
  TextField,
  useOverlayState,
} from '@heroui/react';
import { useState } from 'react';

import { PlusIcon } from '@/components/icons';
import { useMaintenance } from '@/contexts/maintenance-context';

interface FormState {
  item: string;
  performedOn: string;
  odometerKm: number;
  costKrw: number;
  note: string;
}

const emptyForm: FormState = {
  item: '',
  performedOn: '',
  odometerKm: NaN,
  costKrw: NaN,
  note: '',
};

export function MaintenanceFormModal() {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [submitted, setSubmitted] = useState(false);
  const { addRecord } = useMaintenance();

  const state = useOverlayState({
    onOpenChange: (isOpen) => {
      if (!isOpen) {
        setForm(emptyForm);
        setSubmitted(false);
      }
    },
  });

  const isItemInvalid = submitted && !form.item.trim();
  const isDateInvalid = submitted && !form.performedOn.trim();

  const update = (key: 'item' | 'performedOn' | 'note') => (value: string) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const updateNumber = (key: 'odometerKm' | 'costKrw') => (value: number) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const handleSubmit = () => {
    setSubmitted(true);

    if (!form.item.trim() || !form.performedOn.trim()) {
      return;
    }

    addRecord({
      item: form.item.trim(),
      performedOn: form.performedOn.trim(),
      odometerKm: Number.isNaN(form.odometerKm) ? 0 : form.odometerKm,
      costKrw: Number.isNaN(form.costKrw) ? 0 : form.costKrw,
      note: form.note.trim(),
    });

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
                <TextField isInvalid={isItemInvalid} isRequired onChange={update('item')} value={form.item}>
                  <Label>정비 항목</Label>
                  <Input placeholder="예: 엔진오일 교환" />
                  <FieldError>정비 항목을 입력해 주세요.</FieldError>
                </TextField>
                <TextField
                  isInvalid={isDateInvalid}
                  isRequired
                  onChange={update('performedOn')}
                  value={form.performedOn}
                >
                  <Label>정비 일자</Label>
                  <Input type="date" />
                  <FieldError>정비 일자를 입력해 주세요.</FieldError>
                </TextField>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <NumberField minValue={0} onChange={updateNumber('odometerKm')} value={form.odometerKm}>
                    <Label>주행거리 (km)</Label>
                    <NumberField.Group>
                      <NumberField.Input placeholder="48213" />
                    </NumberField.Group>
                  </NumberField>
                  <NumberField minValue={0} onChange={updateNumber('costKrw')} value={form.costKrw}>
                    <Label>비용 (원)</Label>
                    <NumberField.Group>
                      <NumberField.Input placeholder="92000" />
                    </NumberField.Group>
                  </NumberField>
                </div>
                <TextField onChange={update('note')} value={form.note}>
                  <Label>메모</Label>
                  <TextArea placeholder="정비소, 사용 부품 등" rows={3} />
                </TextField>
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
