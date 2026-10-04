import { Card } from '@heroui/react';
import type { ReactNode } from 'react';
import { Link } from 'react-router';

import { ChartCard } from '@/components/ChartCard';
import { DailyDistanceChart } from '@/components/charts/DailyDistanceChart';
import { DailySpeedChart } from '@/components/charts/DailySpeedChart';
import { DataLoadError } from '@/components/DataLoadError';
import { ArrowRightIcon, BatteryIcon, CalendarIcon, CarIcon, RouteIcon, WrenchIcon } from '@/components/Icons';
import { MaintenanceAlertList } from '@/components/MaintenanceAlertList';
import { HeaderPill, PageHeader } from '@/components/PageHeader';
import { Section } from '@/components/Section';
import { StatCard } from '@/components/StatCard';
import { TrendNote } from '@/components/TrendNote';
import { collectorContext } from '@/libs/collector-client.server';
import { formatKstDate, formatKstDateTime, kstDateRangeEndingToday } from '@/libs/datetime';
import { toMaintenanceAlerts } from '@/libs/maintenance';
import { summarizeRecentWeek, toDailyTripPoints } from '@/libs/trip-stats';
import { cn } from '@/libs/utils';
import { toBatteryReading } from '@/libs/vehicle-readings';
import { useVehicleProfile } from '@/libs/vehicle-profile';
import type { BatteryReading } from '@/types/dashboard';

import type { Route } from './+types/dashboard';

const RECENT_DAYS = 14;

export function meta(_: Route.MetaArgs) {
  return [{ title: '대시보드 | 차량 대시보드' }];
}

export async function loader({ context }: Route.LoaderArgs) {
  const collector = context.get(collectorContext);
  const [status, dailyTrips, lastDrive, maintenanceAlerts] = await Promise.all([
    collector.vehicle.status.query(),
    collector.trips.daily.query(kstDateRangeEndingToday(RECENT_DAYS)),
    collector.trips.last.query(),
    collector.maintenance.alerts.query(),
  ]);
  const dailyTripPoints = toDailyTripPoints(dailyTrips);

  return {
    measuredAt: status?.measuredAt ?? null,
    odometerKm: status?.odometerKm ?? null,
    battery: toBatteryReading(status),
    dailyTrips: dailyTripPoints,
    weeklySummary: summarizeRecentWeek(dailyTripPoints),
    lastDrive,
    maintenanceAlerts: toMaintenanceAlerts(maintenanceAlerts),
  };
}

export function ErrorBoundary() {
  return <DataLoadError title="대시보드" />;
}

function batteryHint(battery: BatteryReading | null): string {
  if (!battery) return '전압 미수신';
  return battery.engineOn ? '시동 중 충전 전압' : '12.2V 미만이면 점검 권장';
}

function distanceTrendNote(changePct: number | null): string {
  if (changePct === null) return '직전 7일과 비교할 주행 기록이 없습니다';
  return changePct >= 0 ? '직전 7일 대비 주행량이 늘었습니다' : '직전 7일 대비 주행량이 줄었습니다';
}

/** 카드 안에서 버튼처럼 보이는 링크. button 안에 a 를 넣지 않으려고 Button 대신 쓴다. */
function PillLink({ to, children, isPrimary }: { to: string; children: ReactNode; isPrimary?: boolean }) {
  return (
    <Link
      className={cn(
        'flex h-9 items-center gap-1.5 rounded-full px-4 text-xs font-medium transition-colors',
        isPrimary
          ? 'bg-[var(--accent)] text-[var(--accent-foreground)] hover:bg-[var(--accent-hover)]'
          : 'bg-[var(--surface)] text-[var(--foreground)] shadow-[var(--surface-shadow)] hover:bg-[var(--surface-hover)]'
      )}
      to={to}
    >
      {children}
    </Link>
  );
}

/** 참조 디자인의 잔액 카드 자리. 이 대시보드에서는 누적 주행거리가 그 역할을 한다. */
function OdometerCard({
  model,
  odometerKm,
  distanceChangePct,
  className,
}: {
  model: string;
  odometerKm: number | null;
  distanceChangePct: number | null;
  className?: string;
}) {
  return (
    <Card className={cn('gap-0 p-6', className)}>
      <div className="flex items-start justify-between gap-3">
        <span className="text-[13px] text-[var(--muted)]">총 주행거리</span>
        <span className="rounded-full bg-[var(--foreground)]/[0.04] px-3 py-1 text-xs font-medium text-[var(--muted)]">
          {model}
        </span>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-4xl font-semibold tracking-tight tabular-nums sm:text-5xl">
          {odometerKm === null ? '-' : Math.round(odometerKm).toLocaleString('ko-KR')}
        </span>
        <span className="text-base text-[var(--muted)]">km</span>
      </div>

      <TrendNote
        changePct={distanceChangePct ?? undefined}
        className="mt-3"
        note={distanceTrendNote(distanceChangePct)}
      />

      <div className="mt-6 flex flex-wrap gap-2">
        <PillLink isPrimary to="/vehicle">
          <CarIcon className="size-4" />
          차량 상태
        </PillLink>
        <PillLink to="/trips">
          <RouteIcon className="size-4" />
          주행 기록
        </PillLink>
        <PillLink to="/maintenance">
          <WrenchIcon className="size-4" />
          정비
        </PillLink>
      </div>
    </Card>
  );
}

export default function Dashboard({ loaderData }: Route.ComponentProps) {
  const { measuredAt, odometerKm, battery, dailyTrips, weeklySummary, lastDrive, maintenanceAlerts } = loaderData;
  const vehicleProfile = useVehicleProfile();
  const recentDistanceKm = dailyTrips.reduce((sum, trip) => sum + trip.distanceKm, 0);
  const peakSpeedKph = dailyTrips.length ? Math.max(...dailyTrips.map((trip) => trip.maxSpeedKph)) : 0;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        actions={
          <HeaderPill icon={<CalendarIcon className="size-4" />}>
            {measuredAt ? `${formatKstDate(measuredAt)} 기준` : '수신 기록 없음'}
          </HeaderPill>
        }
        eyebrow={`${vehicleProfile.plateNumber} · ${vehicleProfile.name}`}
        title="대시보드"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <OdometerCard
          className="md:col-span-2"
          distanceChangePct={weeklySummary.distanceChangePct}
          model={vehicleProfile.model}
          odometerKm={odometerKm}
        />
        <StatCard
          changePct={weeklySummary.distanceChangePct ?? undefined}
          hint="직전 7일 대비"
          icon={<RouteIcon className="size-4.5" />}
          label="주간 평균 주행거리"
          unit="km"
          value={weeklySummary.avgDistanceKm.toFixed(1)}
        />
        <StatCard
          hint={batteryHint(battery)}
          icon={<BatteryIcon className="size-4.5" />}
          label="배터리 전압"
          unit="V"
          value={battery ? battery.voltage.toFixed(1) : '-'}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ChartCard hint="최근 14일 합계" label="일일 주행거리" unit="km" value={recentDistanceKm.toFixed(1)}>
          <DailyDistanceChart data={dailyTrips} />
        </ChartCard>
        <ChartCard
          changePct={weeklySummary.speedChangePct ?? undefined}
          hint={`최근 14일 최고 ${peakSpeedKph} km/h`}
          label="일일 속도"
          unit="km/h"
          value={weeklySummary.avgSpeedKph.toFixed(1)}
        >
          <DailySpeedChart data={dailyTrips} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Section
          description={lastDrive ? formatKstDateTime(lastDrive.startedAt) : '주행 기록 없음'}
          title="마지막 운전"
        >
          {lastDrive ? (
            <div className="grid grid-cols-2 gap-4">
              <StatCard label="주행거리" unit="km" value={lastDrive.distanceKm.toFixed(1)} />
              <StatCard label="최고 속도" unit="km/h" value={String(lastDrive.maxSpeedKph)} />
              <StatCard label="평균 속도" unit="km/h" value={String(lastDrive.avgSpeedKph)} />
              <StatCard label="주행 시간" unit="분" value={String(lastDrive.durationMinutes)} />
            </div>
          ) : (
            <Card className="p-6 text-sm text-[var(--muted)]">아직 기록된 주행이 없습니다.</Card>
          )}
        </Section>

        <Section
          action={
            <Link
              className="flex items-center gap-1 rounded-full bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] shadow-[var(--surface-shadow)] transition-colors hover:text-[var(--foreground)]"
              to="/maintenance"
            >
              전체 보기
              <ArrowRightIcon className="size-3.5" />
            </Link>
          }
          description="예정된 정비 항목"
          title="정비 알림"
        >
          <MaintenanceAlertList alerts={maintenanceAlerts} limit={3} />
        </Section>
      </div>
    </div>
  );
}
