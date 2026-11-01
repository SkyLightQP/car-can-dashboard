import { MaintenanceRecordDeleteDialog } from '@/components/MaintenanceRecordDeleteDialog';
import { MaintenanceRecordModal } from '@/components/MaintenanceRecordModal';
import { describeRecordDetails, formatMonthDay } from '@/libs/maintenance';
import type { MaintenanceRecordView } from '@/types/collector';

interface MaintenanceRecordRowProps {
  record: MaintenanceRecordView;
  defaultOdometerKm: number | null;
}

export function MaintenanceRecordRow({ record, defaultOdometerKm }: MaintenanceRecordRowProps) {
  const details = describeRecordDetails(record);

  return (
    <div className="flex h-16 items-center gap-4 pr-2 pl-4 sm:pl-5">
      <time
        className="w-[4.75rem] shrink-0 text-sm font-semibold whitespace-nowrap tabular-nums"
        dateTime={record.performedOn}
      >
        {formatMonthDay(record.performedOn)}
      </time>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm font-medium" title={record.item}>
          {record.item}
        </span>
        {details ? (
          <span className="truncate text-xs text-[var(--muted)]" title={details}>
            {details}
          </span>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center">
        <MaintenanceRecordModal defaultOdometerKm={defaultOdometerKm} record={record} />
        <MaintenanceRecordDeleteDialog record={record} />
      </div>
    </div>
  );
}
