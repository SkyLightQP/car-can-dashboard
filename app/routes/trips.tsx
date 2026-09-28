import { Card, Table } from '@heroui/react';

import { ChartCard } from '@/components/chart-card';
import { WeeklyTrendChart } from '@/components/charts/weekly-trend-chart';
import { DataLoadError } from '@/components/data-load-error';
import { CalendarIcon } from '@/components/icons';
import { HeaderPill, PageHeader } from '@/components/page-header';
import { Section } from '@/components/section';
import { StatCard } from '@/components/stat-card';
import { collectorClient } from '@/libs/collector-client.server';
import { kstDateRangeEndingToday } from '@/libs/datetime';
import { summarizeRecentWeek, toDailyTripPoints, toWeeklyPoints } from '@/libs/trip-stats';

import type { Route } from './+types/trips';

const RECENT_DAYS = 14;
const RECENT_WEEKS = 6;

export function meta(_: Route.MetaArgs) {
  return [{ title: '주행 기록 | 차량 대시보드' }];
}

export async function loader() {
  const [dailyTrips, weeklyTrips] = await Promise.all([
    collectorClient.trips.daily.query(kstDateRangeEndingToday(RECENT_DAYS)),
    collectorClient.trips.weekly.query({ weeks: RECENT_WEEKS }),
  ]);
  const dailyTripPoints = toDailyTripPoints(dailyTrips);

  return {
    dailyTrips: dailyTripPoints,
    weeklySummary: summarizeRecentWeek(dailyTripPoints),
    weeklyTrend: toWeeklyPoints(weeklyTrips),
  };
}

export function ErrorBoundary() {
  return <DataLoadError title="주행 기록" />;
}

export default function Trips({ loaderData }: Route.ComponentProps) {
  const { dailyTrips, weeklySummary, weeklyTrend } = loaderData;
  const totalDistanceKm = dailyTrips.reduce((sum, trip) => sum + trip.distanceKm, 0);
  const drivenDays = dailyTrips.filter((trip) => trip.distanceKm > 0).length;
  const peakSpeedKph = dailyTrips.length ? Math.max(...dailyTrips.map((trip) => trip.maxSpeedKph)) : 0;
  const weeklyTotalKm = weeklyTrend.reduce((sum, point) => sum + point.distanceKm, 0);
  const newestFirstTrips = [...dailyTrips].reverse();
  const period = dailyTrips.length ? `${dailyTrips[0].label} – ${dailyTrips[dailyTrips.length - 1].label}` : '';

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        actions={<HeaderPill icon={<CalendarIcon className="size-4" />}>{period}</HeaderPill>}
        eyebrow="최근 14일 일별 기록"
        title="주행 기록"
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard hint="14일 합계" label="14일 주행거리" unit="km" value={totalDistanceKm.toFixed(1)} />
        <StatCard hint="14일 중" label="주행한 날" unit="일" value={String(drivenDays)} />
        <StatCard hint="14일 최고" label="최고 속도" unit="km/h" value={String(peakSpeedKph)} />
        <StatCard
          changePct={weeklySummary.distanceChangePct ?? undefined}
          hint="직전 7일 대비"
          label="주간 평균 주행거리"
          unit="km"
          value={weeklySummary.avgDistanceKm.toFixed(1)}
        />
      </div>

      <ChartCard hint="최근 6주 합계" label="주간 추이" unit="km" value={weeklyTotalKm.toFixed(0)}>
        <WeeklyTrendChart data={weeklyTrend} />
      </ChartCard>

      <Section description="최신순" title="일별 기록">
        {/*
          Table 기본값인 variant="primary" 는 회색 컨테이너 안에 흰 본문 카드를 넣는 형태라,
          Card 로 한 번 더 감싸면 흰색 → 회색 → 흰색 3중 면이 된다.
          Card 를 유일한 면으로 두고 표는 secondary(배경 없는 납작한 형태)로 쓴다.
        */}
        <Card className="p-3">
          <Table variant="secondary">
            <Table.ScrollContainer>
              <Table.Content aria-label="일별 주행 기록" className="min-w-[640px]">
                <Table.Header>
                  <Table.Column isRowHeader>날짜</Table.Column>
                  <Table.Column>주행거리 (km)</Table.Column>
                  <Table.Column>평균 속도 (km/h)</Table.Column>
                  <Table.Column>최고 속도 (km/h)</Table.Column>
                  <Table.Column>주행 시간</Table.Column>
                </Table.Header>
                <Table.Body>
                  {newestFirstTrips.map((trip) => (
                    <Table.Row key={trip.date}>
                      <Table.Cell>{trip.date}</Table.Cell>
                      <Table.Cell className="tabular-nums">{trip.distanceKm.toFixed(1)}</Table.Cell>
                      <Table.Cell className="tabular-nums">{trip.avgSpeedKph}</Table.Cell>
                      <Table.Cell className="tabular-nums">{trip.maxSpeedKph}</Table.Cell>
                      <Table.Cell>{trip.drivingMinutes > 0 ? `${trip.drivingMinutes}분` : '주행 없음'}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Content>
            </Table.ScrollContainer>
          </Table>
        </Card>
      </Section>
    </div>
  );
}
