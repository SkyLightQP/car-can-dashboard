import type { DailyTrips, WeeklyTrips } from '@/types/collector';
import type { DailyTrip, WeeklyPoint, WeeklySummary } from '@/types/dashboard';

const DAYS_PER_WEEK = 7;

export function toDailyTripPoints(trips: DailyTrips): DailyTrip[] {
  return trips.map((trip) => ({ ...trip, label: trip.date.slice(5) }));
}

export function toWeeklyPoints(weeks: WeeklyTrips): WeeklyPoint[] {
  return weeks.map(({ weekStart, distanceKm, avgSpeedKph }) => {
    const month = Number(weekStart.slice(5, 7));
    const weekOfMonth = Math.ceil(Number(weekStart.slice(8, 10)) / DAYS_PER_WEEK);

    return { weekLabel: `${month}월 ${weekOfMonth}주`, distanceKm, avgSpeedKph };
  });
}

function totalDrivingOf(trips: DailyTrip[]): { distanceKm: number; avgSpeedKph: number } {
  const distanceKm = trips.reduce((sum, trip) => sum + trip.distanceKm, 0);
  const drivingMinutes = trips.reduce((sum, trip) => sum + trip.drivingMinutes, 0);
  const speedMinutes = trips.reduce((sum, trip) => sum + trip.avgSpeedKph * trip.drivingMinutes, 0);

  return { distanceKm, avgSpeedKph: drivingMinutes > 0 ? speedMinutes / drivingMinutes : 0 };
}

function changePctFrom(previous: number, current: number): number | null {
  return previous > 0 ? ((current - previous) / previous) * 100 : null;
}

export function summarizeRecentWeek(trips: DailyTrip[]): WeeklySummary {
  const recentWeek = totalDrivingOf(trips.slice(-DAYS_PER_WEEK));
  const previousWeek = totalDrivingOf(trips.slice(-DAYS_PER_WEEK * 2, -DAYS_PER_WEEK));

  return {
    avgDistanceKm: recentWeek.distanceKm / DAYS_PER_WEEK,
    avgSpeedKph: recentWeek.avgSpeedKph,
    distanceChangePct: changePctFrom(previousWeek.distanceKm, recentWeek.distanceKm),
    speedChangePct: changePctFrom(previousWeek.avgSpeedKph, recentWeek.avgSpeedKph),
  };
}
