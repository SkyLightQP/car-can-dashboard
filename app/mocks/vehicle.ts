import type { BatteryHistoryPoint, BatteryReading, TireReading, VehicleInfo } from '@/types/dashboard';

export const vehicleInfo: VehicleInfo = {
  name: '내 차량',
  model: '아이오닉 5 롱레인지',
  plateNumber: '12가 3456',
  totalDistanceKm: 48213,
};

export const tireReadings: TireReading[] = [
  { position: 'frontLeft', label: '앞 왼쪽', pressurePsi: 34.2, recommendedPsi: 35, status: 'normal' },
  { position: 'frontRight', label: '앞 오른쪽', pressurePsi: 33.8, recommendedPsi: 35, status: 'normal' },
  { position: 'rearLeft', label: '뒤 왼쪽', pressurePsi: 29.8, recommendedPsi: 35, status: 'warning' },
  { position: 'rearRight', label: '뒤 오른쪽', pressurePsi: 34.5, recommendedPsi: 35, status: 'normal' },
];

export const batteryReading: BatteryReading = {
  voltage: 12.4,
  status: 'normal',
  measuredAt: '2026-08-25T08:12:00+09:00',
};

export const batteryHistory: BatteryHistoryPoint[] = [
  { label: '08-19', voltage: 12.6 },
  { label: '08-20', voltage: 12.5 },
  { label: '08-21', voltage: 12.5 },
  { label: '08-22', voltage: 12.3 },
  { label: '08-23', voltage: 12.2 },
  { label: '08-24', voltage: 12.4 },
  { label: '08-25', voltage: 12.4 },
];
