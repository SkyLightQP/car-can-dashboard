import type { MaintenanceRecord } from '@/types/dashboard';

export const mockCurrentOdometerKm = 48213;

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
  {
    id: 'mr-4',
    item: '타이어 위치 교환',
    performedOn: '2026-02-10',
    odometerKm: 39500,
    costKrw: 30000,
    note: '앞뒤 교차 로테이션',
  },
  {
    id: 'mr-5',
    item: '브레이크 패드 교체',
    performedOn: '2025-11-20',
    odometerKm: 27890,
    costKrw: 210000,
    note: '전륜만 교체',
  },
];
