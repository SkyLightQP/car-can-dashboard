import type { VehicleStatus } from '@/types/collector';
import type { StatusLevel, TirePosition, TireReading } from '@/types/dashboard';

const tireLabels: Record<TirePosition, string> = {
  frontLeft: '앞 왼쪽',
  frontRight: '앞 오른쪽',
  rearLeft: '뒤 왼쪽',
  rearRight: '뒤 오른쪽',
};

const RECOMMENDED_TIRE_PSI = 35;
const TIRE_WARNING_DEVIATION_PSI = 3;
const TIRE_CRITICAL_DEVIATION_PSI = 6;

function tireStatus(pressurePsi: number): StatusLevel {
  const deviation = Math.abs(pressurePsi - RECOMMENDED_TIRE_PSI);
  if (deviation > TIRE_CRITICAL_DEVIATION_PSI) return 'critical';
  if (deviation > TIRE_WARNING_DEVIATION_PSI) return 'warning';
  return 'normal';
}

export function toTireReadings(status: VehicleStatus | null): TireReading[] {
  const positions = Object.keys(tireLabels) as TirePosition[];

  return positions.map((position) => {
    const pressurePsi = status?.tires[position] ?? null;

    return {
      position,
      label: tireLabels[position],
      pressurePsi,
      recommendedPsi: RECOMMENDED_TIRE_PSI,
      status: pressurePsi === null ? null : tireStatus(pressurePsi),
    };
  });
}
