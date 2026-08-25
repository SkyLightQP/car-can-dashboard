import type { MaintenanceAlert, MaintenanceRecord } from '@/types/dashboard';

export const maintenanceAlerts: MaintenanceAlert[] = [
  { id: 'ma-1', item: '브레이크 패드 점검', dueDescription: '권장 주기 320km 초과', status: 'critical' },
  { id: 'ma-2', item: '엔진오일 교환', dueDescription: '1,200km 남음', status: 'warning' },
  { id: 'ma-3', item: '타이어 위치 교환', dueDescription: '2026-09-10 예정', status: 'normal' },
];

export const initialMaintenanceRecords: MaintenanceRecord[] = [
  {
    id: 'mr-1',
    item: '에어컨 필터 교체',
    performedOn: '2026-07-14',
    odometerKm: 46980,
    costKrw: 38000,
    note: '실내 필터만 교체',
  },
  {
    id: 'mr-2',
    item: '엔진오일 교환',
    performedOn: '2026-05-02',
    odometerKm: 43120,
    costKrw: 92000,
    note: '합성유, 오일필터 동시 교체',
  },
  {
    id: 'mr-3',
    item: '타이어 4본 교체',
    performedOn: '2026-03-18',
    odometerKm: 40550,
    costKrw: 640000,
    note: '사계절 타이어로 교체',
  },
];
