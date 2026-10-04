import type { VehicleProfile } from '@/types/dashboard';

const DEFAULT_RECOMMENDED_TIRE_PSI = 35;

export function readRecommendedTirePsi(): number {
  const configured = process.env.VEHICLE_RECOMMENDED_TIRE_PSI;
  if (!configured) return DEFAULT_RECOMMENDED_TIRE_PSI;

  const psi = Number(configured);
  if (!Number.isFinite(psi) || psi <= 0) {
    throw new Error(`VEHICLE_RECOMMENDED_TIRE_PSI 는 0보다 큰 숫자여야 합니다: ${configured}`);
  }
  return psi;
}

export function readVehicleProfile(): VehicleProfile {
  return {
    name: '내 차량',
    model: process.env.VEHICLE_MODEL || '차량 모델 미설정',
    plateNumber: process.env.VEHICLE_PLATE_NUMBER || '번호판 미설정',
  };
}
