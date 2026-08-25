import { Card } from '@heroui/react';
import { Link } from 'react-router';

import { DailyDistanceChart } from '@/components/charts/daily-distance-chart';
import { DailySpeedChart } from '@/components/charts/daily-speed-chart';
import { BatteryIcon, GaugeIcon, RouteIcon } from '@/components/icons';
import { MaintenanceAlertList } from '@/components/maintenance-alert-list';
import { Section } from '@/components/section';
import { StatCard } from '@/components/stat-card';
import { maintenanceAlerts } from '@/mocks/maintenance';
import { dailyTrips, lastDrive, weeklySummary } from '@/mocks/trips';
import { batteryReading, vehicleInfo } from '@/mocks/vehicle';

import type { Route } from './+types/dashboard';

export function meta(_: Route.MetaArgs) {
  return [{ title: '대시보드 | 차량 대시보드' }];
}

const lastDriveDate = new Date(lastDrive.startedAt).toLocaleString('ko-KR', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Asia/Seoul',
});

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">대시보드</h1>
        <p className="text-[var(--foreground)]/60 text-sm">최근 14일 주행 데이터 기준</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          hint="누적"
          icon={<GaugeIcon className="size-5" />}
          label="총 주행거리"
          unit="km"
          value={vehicleInfo.totalDistanceKm.toLocaleString('ko-KR')}
        />
        <StatCard
          changePct={weeklySummary.distanceChangePct}
          hint="지난주 대비"
          icon={<RouteIcon className="size-5" />}
          label="주간 평균 주행거리"
          unit="km"
          value={weeklySummary.avgDistanceKm.toFixed(1)}
        />
        <StatCard
          changePct={weeklySummary.speedChangePct}
          hint="지난주 대비"
          label="주간 평균 속도"
          unit="km/h"
          value={weeklySummary.avgSpeedKph.toFixed(1)}
        />
        <StatCard
          hint="12.2V 미만이면 점검 권장"
          icon={<BatteryIcon className="size-5" />}
          label="배터리 전압"
          unit="V"
          value={batteryReading.voltage.toFixed(1)}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Section description="최근 14일" title="일일 주행거리">
          <Card className="p-4">
            <DailyDistanceChart data={dailyTrips} />
          </Card>
        </Section>
        <Section description="최근 14일" title="일일 속도">
          <Card className="p-4">
            <DailySpeedChart data={dailyTrips} />
          </Card>
        </Section>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Section description={lastDriveDate} title="마지막 운전">
          <div className="grid grid-cols-2 gap-4">
            <StatCard label="주행거리" unit="km" value={lastDrive.distanceKm.toFixed(1)} />
            <StatCard label="최고 속도" unit="km/h" value={String(lastDrive.maxSpeedKph)} />
            <StatCard label="평균 속도" unit="km/h" value={String(lastDrive.avgSpeedKph)} />
            <StatCard label="주행 시간" unit="분" value={String(lastDrive.durationMinutes)} />
          </div>
        </Section>

        <Section
          action={
            <Link className="text-[var(--link)] text-sm underline-offset-4 hover:underline" to="/maintenance">
              전체 보기
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
