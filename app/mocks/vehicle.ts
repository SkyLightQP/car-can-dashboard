import type { BatteryReading, VehicleInfo } from '@/types/dashboard';

export const vehicleInfo: VehicleInfo = {
  name: '내 차량',
  model: '아이오닉 5 롱레인지',
  plateNumber: '12가 3456',
  totalDistanceKm: 48213,
};

export const batteryReading: BatteryReading = {
  voltage: 12.4,
  status: 'normal',
  measuredAt: '2026-08-25T08:12:00+09:00',
  engineOn: false,
};
