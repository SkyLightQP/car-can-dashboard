import type {
  CreateMaintenanceRecordInput,
  MaintenanceAlerts,
  MaintenanceType,
  UpdateMaintenanceRecordInput,
  UpdateMaintenanceScheduleInput,
} from '@/types/collector';
import type { MaintenanceAlert } from '@/types/dashboard';

type CollectorMaintenanceAlert = MaintenanceAlerts['alerts'][number];

export type MaintenanceIntent =
  | { intent: 'createRecord'; record: CreateMaintenanceRecordInput }
  | { intent: 'updateRecord'; record: UpdateMaintenanceRecordInput }
  | { intent: 'deleteRecord'; id: string }
  | { intent: 'updateSchedule'; schedule: UpdateMaintenanceScheduleInput };

export type MaintenanceActionResult = { ok: true } | { ok: false; error: string };

export const maintenanceTypeLabels: Record<MaintenanceType, string> = {
  engine_oil: '엔진오일 교환',
  brake_pad: '브레이크 패드 점검',
  brake_fluid: '브레이크 오일 교환',
  other: '기타',
};

export const maintenanceTypes = Object.keys(maintenanceTypeLabels) as MaintenanceType[];

export function formatKm(km: number): string {
  return `${km.toLocaleString('ko-KR')}km`;
}

function typeOrder(type: MaintenanceType): number {
  return maintenanceTypes.indexOf(type);
}

export function sortByMaintenanceType<T extends { type: MaintenanceType }>(items: T[]): T[] {
  return [...items].sort((a, b) => typeOrder(a.type) - typeOrder(b.type));
}

function describeDue(alert: CollectorMaintenanceAlert): string {
  if (!alert.lastRecord) return `정비 이력 없음 · 주기 ${formatKm(alert.intervalKm)}`;
  if (alert.remainingKm === null) return '현재 주행거리 미수신';
  if (alert.remainingKm < 0) return `권장 주기 ${formatKm(Math.abs(alert.remainingKm))} 초과`;
  return `${formatKm(alert.remainingKm)} 남음`;
}

export function toMaintenanceAlerts({ alerts }: MaintenanceAlerts): MaintenanceAlert[] {
  return sortByMaintenanceType(alerts).map((alert) => ({
    id: alert.type,
    item: maintenanceTypeLabels[alert.type],
    dueDescription: describeDue(alert),
    status: alert.status,
  }));
}
