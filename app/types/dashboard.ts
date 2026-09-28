export type StatusLevel = 'normal' | 'warning' | 'critical';

export type TirePosition = 'frontLeft' | 'frontRight' | 'rearLeft' | 'rearRight';

export interface TireReading {
  position: TirePosition;
  label: string;
  pressurePsi: number | null;
  recommendedPsi: number;
  status: StatusLevel | null;
}

export interface BatteryReading {
  voltage: number;
  status: StatusLevel;
  measuredAt: string;
  engineOn: boolean;
}

export interface BatteryHistoryPoint {
  label: string;
  voltage: number | null;
}

export interface VehicleInfo {
  name: string;
  model: string;
  plateNumber: string;
  totalDistanceKm: number;
}

export interface VehicleProfile {
  name: string;
  model: string;
  plateNumber: string;
}

export interface DailyTrip {
  date: string;
  label: string;
  distanceKm: number;
  avgSpeedKph: number;
  maxSpeedKph: number;
  drivingMinutes: number;
}

export interface LastDrive {
  startedAt: string;
  distanceKm: number;
  maxSpeedKph: number;
  avgSpeedKph: number;
  durationMinutes: number;
}

export interface WeeklySummary {
  avgDistanceKm: number;
  avgSpeedKph: number;
  distanceChangePct: number;
  speedChangePct: number;
}

export interface WeeklyPoint {
  weekLabel: string;
  distanceKm: number;
  avgSpeedKph: number;
}

export interface MaintenanceAlert {
  id: string;
  item: string;
  dueDescription: string;
  status: StatusLevel;
}

export interface MaintenanceRecord {
  id: string;
  item: string;
  performedOn: string;
  odometerKm: number;
  costKrw: number;
  note: string;
}
