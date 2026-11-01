import { MaintenanceScheduleRow } from '@/components/MaintenanceScheduleRow';
import type { MaintenanceScheduleView } from '@/types/collector';

export function MaintenanceScheduleSettings({ schedules }: { schedules: MaintenanceScheduleView[] }) {
  return (
    <ul className="flex flex-col gap-2.5">
      {schedules.map((schedule) => (
        <li key={`${schedule.type}-${schedule.intervalKm}-${schedule.warningKm}-${schedule.enabled}`}>
          <MaintenanceScheduleRow schedule={schedule} />
        </li>
      ))}
    </ul>
  );
}
