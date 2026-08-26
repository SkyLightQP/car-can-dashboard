import { Card, Table } from '@heroui/react';

import { WeeklyTrendChart } from '@/components/charts/weekly-trend-chart';
import { Section } from '@/components/section';
import { StatCard } from '@/components/stat-card';
import { dailyTrips, weeklySummary, weeklyTrend } from '@/mocks/trips';

import type { Route } from './+types/trips';

export function meta(_: Route.MetaArgs) {
  return [{ title: '주행 기록 | 차량 대시보드' }];
}

const totalDistanceKm = dailyTrips.reduce((sum, trip) => sum + trip.distanceKm, 0);
const drivenDays = dailyTrips.filter((trip) => trip.distanceKm > 0).length;
const peakSpeedKph = Math.max(...dailyTrips.map((trip) => trip.maxSpeedKph));

// 최신 날짜가 위로 오도록 뒤집는다. mock 배열 자체는 건드리지 않는다.
const rows = [...dailyTrips].reverse();

export default function Trips() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">주행 기록</h1>
        <p className="text-sm text-[var(--foreground)]/60">최근 14일 일별 기록</p>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard hint="14일 합계" label="총 주행거리" unit="km" value={totalDistanceKm.toFixed(1)} />
        <StatCard hint="14일 중" label="주행한 날" unit="일" value={String(drivenDays)} />
        <StatCard hint="14일 최고" label="최고 속도" unit="km/h" value={String(peakSpeedKph)} />
        <StatCard
          changePct={weeklySummary.distanceChangePct}
          hint="지난주 대비"
          label="주간 평균 주행거리"
          unit="km"
          value={weeklySummary.avgDistanceKm.toFixed(1)}
        />
      </div>

      <Section description="최근 6주 주행거리" title="주간 추이">
        <Card className="p-4">
          <WeeklyTrendChart data={weeklyTrend} />
        </Card>
      </Section>

      <Section description="최신순" title="일별 기록">
        <Card className="p-2">
          <Table>
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
                  {rows.map((trip) => (
                    <Table.Row key={trip.date}>
                      <Table.Cell>{trip.date}</Table.Cell>
                      <Table.Cell>{trip.distanceKm.toFixed(1)}</Table.Cell>
                      <Table.Cell>{trip.avgSpeedKph}</Table.Cell>
                      <Table.Cell>{trip.maxSpeedKph}</Table.Cell>
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
