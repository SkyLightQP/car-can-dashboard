import type { DailyTrip, LastDrive, WeeklyPoint, WeeklySummary } from '@/types/dashboard';

export const dailyTrips: DailyTrip[] = [
  { date: '2026-08-12', label: '08-12', distanceKm: 42.3, avgSpeedKph: 38, maxSpeedKph: 92, drivingMinutes: 67 },
  { date: '2026-08-13', label: '08-13', distanceKm: 18.7, avgSpeedKph: 31, maxSpeedKph: 74, drivingMinutes: 36 },
  { date: '2026-08-14', label: '08-14', distanceKm: 56.1, avgSpeedKph: 45, maxSpeedKph: 108, drivingMinutes: 75 },
  { date: '2026-08-15', label: '08-15', distanceKm: 0, avgSpeedKph: 0, maxSpeedKph: 0, drivingMinutes: 0 },
  { date: '2026-08-16', label: '08-16', distanceKm: 78.4, avgSpeedKph: 52, maxSpeedKph: 116, drivingMinutes: 90 },
  { date: '2026-08-17', label: '08-17', distanceKm: 31.2, avgSpeedKph: 35, maxSpeedKph: 81, drivingMinutes: 53 },
  { date: '2026-08-18', label: '08-18', distanceKm: 44.8, avgSpeedKph: 40, maxSpeedKph: 97, drivingMinutes: 67 },
  { date: '2026-08-19', label: '08-19', distanceKm: 39.5, avgSpeedKph: 37, maxSpeedKph: 88, drivingMinutes: 64 },
  { date: '2026-08-20', label: '08-20', distanceKm: 62.0, avgSpeedKph: 48, maxSpeedKph: 112, drivingMinutes: 78 },
  { date: '2026-08-21', label: '08-21', distanceKm: 27.6, avgSpeedKph: 33, maxSpeedKph: 79, drivingMinutes: 50 },
  { date: '2026-08-22', label: '08-22', distanceKm: 91.3, avgSpeedKph: 58, maxSpeedKph: 124, drivingMinutes: 94 },
  { date: '2026-08-23', label: '08-23', distanceKm: 12.4, avgSpeedKph: 28, maxSpeedKph: 62, drivingMinutes: 27 },
  { date: '2026-08-24', label: '08-24', distanceKm: 48.9, avgSpeedKph: 42, maxSpeedKph: 103, drivingMinutes: 70 },
  { date: '2026-08-25', label: '08-25', distanceKm: 35.7, avgSpeedKph: 36, maxSpeedKph: 89, drivingMinutes: 60 },
];

export const lastDrive: LastDrive = {
  startedAt: '2026-08-25T18:24:00+09:00',
  distanceKm: 35.7,
  maxSpeedKph: 89,
  avgSpeedKph: 36,
  durationMinutes: 60,
};

export const weeklySummary: WeeklySummary = {
  avgDistanceKm: 45.3,
  avgSpeedKph: 40.3,
  distanceChangePct: 16.9,
  speedChangePct: 17.2,
};

export const weeklyTrend: WeeklyPoint[] = [
  { weekLabel: '7월 3주', distanceKm: 262.4, avgSpeedKph: 36.1 },
  { weekLabel: '7월 4주', distanceKm: 298.7, avgSpeedKph: 38.5 },
  { weekLabel: '7월 5주', distanceKm: 211.9, avgSpeedKph: 33.2 },
  { weekLabel: '8월 1주', distanceKm: 334.6, avgSpeedKph: 41.0 },
  { weekLabel: '8월 2주', distanceKm: 271.5, avgSpeedKph: 34.4 },
  { weekLabel: '8월 3주', distanceKm: 317.4, avgSpeedKph: 40.3 },
];
