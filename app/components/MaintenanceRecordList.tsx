import { Card } from '@heroui/react';

import { MaintenanceRecordRow } from '@/components/MaintenanceRecordRow';
import { groupRecordsByYear } from '@/libs/maintenance';
import type { MaintenanceRecordView } from '@/types/collector';

interface MaintenanceRecordListProps {
  records: MaintenanceRecordView[];
  defaultOdometerKm: number | null;
}

export function MaintenanceRecordList({ records, defaultOdometerKm }: MaintenanceRecordListProps) {
  return (
    <div className="flex flex-col gap-5">
      {groupRecordsByYear(records).map(({ year, records: yearRecords }) => (
        <section aria-label={`${year}년 정비 이력`} className="flex flex-col gap-2" key={year}>
          <h3 className="px-1 text-xs font-medium text-[var(--muted)] tabular-nums">{year}년</h3>
          <Card className="gap-0 p-0">
            <ul className="divide-y divide-[var(--separator)]">
              {yearRecords.map((record) => (
                <li key={record.id}>
                  <MaintenanceRecordRow defaultOdometerKm={defaultOdometerKm} record={record} />
                </li>
              ))}
            </ul>
          </Card>
        </section>
      ))}
    </div>
  );
}
