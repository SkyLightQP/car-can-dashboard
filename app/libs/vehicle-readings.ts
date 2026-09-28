import type { BatteryHistory, VehicleStatus } from '@/types/collector';
import type { BatteryHistoryPoint, BatteryReading, StatusLevel, TirePosition, TireReading } from '@/types/dashboard';

const tireLabels: Record<TirePosition, string> = {
  frontLeft: '앞 왼쪽',
  frontRight: '앞 오른쪽',
  rearLeft: '뒤 왼쪽',
  rearRight: '뒤 오른쪽',
};

const RECOMMENDED_TIRE_PSI = 35;
const TIRE_WARNING_DEVIATION_PSI = 3;
const TIRE_CRITICAL_DEVIATION_PSI = 6;

const RESTING_WARNING_VOLTAGE = 12.4;
const RESTING_CRITICAL_VOLTAGE = 12.2;
const CHARGING_MIN_VOLTAGE = 12.6;
const CHARGING_MAX_VOLTAGE = 15;

function tireStatus(pressurePsi: number): StatusLevel {
  const deviation = Math.abs(pressurePsi - RECOMMENDED_TIRE_PSI);
  if (deviation > TIRE_CRITICAL_DEVIATION_PSI) return 'critical';
  if (deviation > TIRE_WARNING_DEVIATION_PSI) return 'warning';
  return 'normal';
}

function batteryStatus(voltage: number, engineOn: boolean): StatusLevel {
  if (engineOn) {
    return voltage < CHARGING_MIN_VOLTAGE || voltage > CHARGING_MAX_VOLTAGE ? 'warning' : 'normal';
  }
  if (voltage < RESTING_CRITICAL_VOLTAGE) return 'critical';
  if (voltage < RESTING_WARNING_VOLTAGE) return 'warning';
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

export function toBatteryReading(status: VehicleStatus | null): BatteryReading | null {
  if (!status || status.batteryVoltageV === null) return null;

  return {
    voltage: status.batteryVoltageV,
    status: batteryStatus(status.batteryVoltageV, status.engineOn),
    measuredAt: status.measuredAt,
    engineOn: status.engineOn,
  };
}

export function toBatteryHistoryPoints(history: BatteryHistory): BatteryHistoryPoint[] {
  return history.map(({ date, voltageV }) => ({ label: date.slice(5), voltage: voltageV }));
}
