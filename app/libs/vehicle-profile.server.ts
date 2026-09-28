import type { VehicleProfile } from '@/types/dashboard';

export function readVehicleProfile(): VehicleProfile {
  return {
    name: '내 차량',
    model: process.env.VEHICLE_MODEL || '차량 모델 미설정',
    plateNumber: process.env.VEHICLE_PLATE_NUMBER || '번호판 미설정',
  };
}
