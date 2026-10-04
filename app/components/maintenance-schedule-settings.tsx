import { Button, Card, FieldError, Label, NumberField, Switch } from '@heroui/react';
import { useState } from 'react';
import { useFetcher } from 'react-router';

import { type MaintenanceActionResult, type MaintenanceIntent, maintenanceTypeLabels } from '@/libs/maintenance';
import type { MaintenanceScheduleView } from '@/types/collector';

export function MaintenanceScheduleSettings({ schedules }: { schedules: MaintenanceScheduleView[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {schedules.map((schedule) => (
        <li key={`${schedule.type}-${schedule.intervalKm}-${schedule.warningKm}-${schedule.enabled}`}>
          <ScheduleRow schedule={schedule} />
        </li>
      ))}
    </ul>
  );
}

function ScheduleRow({ schedule }: { schedule: MaintenanceScheduleView }) {
  const fetcher = useFetcher<MaintenanceActionResult>();
  const [draft, setDraft] = useState(schedule);
  const result = fetcher.data;

  const isIntervalInvalid = Number.isNaN(draft.intervalKm) || draft.intervalKm < 1;
  const isWarningInvalid = Number.isNaN(draft.warningKm) || draft.warningKm < 0 || draft.warningKm > draft.intervalKm;
  const isChanged =
    draft.intervalKm !== schedule.intervalKm ||
    draft.warningKm !== schedule.warningKm ||
    draft.enabled !== schedule.enabled;

  const handleSave = () => {
    const payload: MaintenanceIntent = { intent: 'updateSchedule', schedule: draft };
    void fetcher.submit(payload, { method: 'post', encType: 'application/json', action: '/maintenance' });
  };

  return (
    <Card className="flex flex-col gap-4 p-4 lg:flex-row lg:items-end">
      <div className="flex min-w-40 flex-col gap-2 lg:self-center">
        <span className="text-sm font-medium">{maintenanceTypeLabels[schedule.type]}</span>
        <Switch
          isSelected={draft.enabled}
          onChange={(enabled) => setDraft((previous) => ({ ...previous, enabled }))}
          size="sm"
        >
          <Switch.Content>
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
            <span className="text-xs text-[var(--muted)]">알림 {draft.enabled ? '켜짐' : '꺼짐'}</span>
          </Switch.Content>
        </Switch>
      </div>
      <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2">
        <NumberField
          isInvalid={isIntervalInvalid}
          minValue={1}
          onChange={(intervalKm) => setDraft((previous) => ({ ...previous, intervalKm }))}
          value={draft.intervalKm}
        >
          <Label>정비 주기 (km)</Label>
          <NumberField.Group>
            <NumberField.Input className="col-span-full" />
          </NumberField.Group>
          <FieldError>1km 이상으로 입력해 주세요.</FieldError>
        </NumberField>
        <NumberField
          isInvalid={isWarningInvalid}
          minValue={0}
          onChange={(warningKm) => setDraft((previous) => ({ ...previous, warningKm }))}
          value={draft.warningKm}
        >
          <Label>주의 구간 (남은 km)</Label>
          <NumberField.Group>
            <NumberField.Input className="col-span-full" />
          </NumberField.Group>
          <FieldError>0 이상, 정비 주기 이하로 입력해 주세요.</FieldError>
        </NumberField>
      </div>
      <div className="flex flex-col items-end gap-1">
        <Button
          isDisabled={!isChanged || isIntervalInvalid || isWarningInvalid}
          isPending={fetcher.state !== 'idle'}
          onPress={handleSave}
          size="sm"
          variant="primary"
        >
          저장
        </Button>
        {result && !result.ok ? <p className="text-xs text-[var(--danger)]">{result.error}</p> : null}
      </div>
    </Card>
  );
}
