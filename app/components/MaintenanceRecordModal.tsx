import {
  Button,
  FieldError,
  Input,
  Label,
  ListBox,
  Modal,
  NumberField,
  Select,
  TextArea,
  TextField,
  useOverlayState,
} from '@heroui/react';
import { useEffect, useState } from 'react';
import { useFetcher } from 'react-router';

import { PlusIcon } from '@/components/Icons';
import { kstDateRangeEndingToday } from '@/libs/datetime';
import {
  type MaintenanceActionResult,
  type MaintenanceIntent,
  maintenanceTypeLabels,
  maintenanceTypes,
} from '@/libs/maintenance';
import type { MaintenanceRecordView, MaintenanceType } from '@/types/collector';

interface MaintenanceRecordModalProps {
  record?: MaintenanceRecordView;
  defaultOdometerKm: number | null;
}

interface FormState {
  type: MaintenanceType | null;
  item: string;
  performedOn: string;
  odometerKm: number;
  costKrw: number;
  note: string;
}

function initialForm(record: MaintenanceRecordView | undefined, defaultOdometerKm: number | null): FormState {
  if (record) {
    return { ...record };
  }

  return {
    type: null,
    item: '',
    performedOn: kstDateRangeEndingToday(1).to,
    odometerKm: defaultOdometerKm ?? NaN,
    costKrw: NaN,
    note: '',
  };
}

function defaultItemFor(type: MaintenanceType): string {
  return type === 'other' ? '' : maintenanceTypeLabels[type];
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
            <RecordForm defaultOdometerKm={defaultOdometerKm} onDone={state.close} record={record} />
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}

function RecordForm({ record, defaultOdometerKm, onDone }: MaintenanceRecordModalProps & { onDone: () => void }) {
  const fetcher = useFetcher<MaintenanceActionResult>();
  const [form, setForm] = useState<FormState>(() => initialForm(record, defaultOdometerKm));
  const [submitted, setSubmitted] = useState(false);
  const result = fetcher.data;
  const isSubmitting = fetcher.state !== 'idle';

  useEffect(() => {
    if (result?.ok) onDone();
  }, [result, onDone]);

  const isTypeInvalid = submitted && !form.type;
  const isItemInvalid = submitted && !form.item.trim();
  const isDateInvalid = submitted && !form.performedOn.trim();
  const isOdometerInvalid = submitted && Number.isNaN(form.odometerKm);

  const update = (key: 'item' | 'performedOn' | 'note') => (value: string) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const updateNumber = (key: 'odometerKm' | 'costKrw') => (value: number) => {
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const updateType = (value: unknown) => {
    const type = value as MaintenanceType;
    setForm((previous) => ({ ...previous, type, item: previous.item.trim() ? previous.item : defaultItemFor(type) }));
  };

  const handleSubmit = () => {
    setSubmitted(true);

    if (!form.type || !form.item.trim() || !form.performedOn.trim() || Number.isNaN(form.odometerKm)) {
      return;
    }

    const fields = {
      type: form.type,
      item: form.item.trim(),
      performedOn: form.performedOn.trim(),
      odometerKm: form.odometerKm,
      costKrw: Number.isNaN(form.costKrw) ? 0 : form.costKrw,
      note: form.note.trim(),
    };
    const payload: MaintenanceIntent = record
      ? { intent: 'updateRecord', record: { id: record.id, ...fields } }
      : { intent: 'createRecord', record: fields };

    void fetcher.submit(payload, { method: 'post', encType: 'application/json', action: '/maintenance' });
  };

  return (
    <>
      <Modal.Header>
        <Modal.Heading>{record ? '정비 기록 수정' : '정비 기록 추가'}</Modal.Heading>
      </Modal.Header>
      <Modal.Body>
        <div className="flex flex-col gap-4">
          <Select
            fullWidth
            isInvalid={isTypeInvalid}
            isRequired
            onChange={updateType}
            placeholder="정비 종류 선택"
            value={form.type}
          >
            <Label>정비 종류</Label>
            <Select.Trigger>
              <Select.Value />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox>
                {maintenanceTypes.map((type) => (
                  <ListBox.Item id={type} key={type} textValue={maintenanceTypeLabels[type]}>
                    {maintenanceTypeLabels[type]}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
            <FieldError>정비 종류를 선택해 주세요.</FieldError>
          </Select>
          <TextField isInvalid={isItemInvalid} isRequired onChange={update('item')} value={form.item}>
            <Label>정비 항목</Label>
            <Input placeholder="예: 엔진오일 교환" />
            <FieldError>정비 항목을 입력해 주세요.</FieldError>
          </TextField>
          <TextField isInvalid={isDateInvalid} isRequired onChange={update('performedOn')} value={form.performedOn}>
            <Label>정비 일자</Label>
            <Input type="date" />
            <FieldError>정비 일자를 입력해 주세요.</FieldError>
          </TextField>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <NumberField
              isInvalid={isOdometerInvalid}
              isRequired
              minValue={0}
              onChange={updateNumber('odometerKm')}
              value={form.odometerKm}
            >
              <Label>주행거리 (km)</Label>
              <NumberField.Group>
                <NumberField.Input className="col-span-full" placeholder="48213" />
              </NumberField.Group>
              <FieldError>정비 시점의 주행거리를 입력해 주세요.</FieldError>
            </NumberField>
            <NumberField minValue={0} onChange={updateNumber('costKrw')} value={form.costKrw}>
              <Label>비용 (원)</Label>
              <NumberField.Group>
                <NumberField.Input className="col-span-full" placeholder="92000" />
              </NumberField.Group>
            </NumberField>
          </div>
          <TextField onChange={update('note')} value={form.note}>
            <Label>메모</Label>
            <TextArea placeholder="정비소, 사용 부품 등" rows={3} />
          </TextField>
          {result && !result.ok ? <p className="text-sm text-[var(--danger)]">{result.error}</p> : null}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button onPress={onDone} variant="tertiary">
          취소
        </Button>
        <Button isPending={isSubmitting} onPress={handleSubmit} variant="primary">
          {record ? '저장' : '추가'}
        </Button>
      </Modal.Footer>
    </>
  );
}
