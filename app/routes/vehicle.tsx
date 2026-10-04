import { BatteryGauge } from '@/components/BatteryGauge';
import { ChartCard } from '@/components/ChartCard';
import { BatteryTrendChart } from '@/components/charts/BatteryTrendChart';
import { DataLoadError } from '@/components/DataLoadError';
import { CalendarIcon } from '@/components/Icons';
import { HeaderPill, PageHeader } from '@/components/PageHeader';
import { Section } from '@/components/Section';
import { StatCard } from '@/components/StatCard';
import { TirePressureDiagram } from '@/components/TirePressureDiagram';
import { collectorContext } from '@/libs/collector-client.server';
import { formatKstDate } from '@/libs/datetime';
import { toBatteryHistoryPoints, toBatteryReading, toTireReadings } from '@/libs/vehicle-readings';
import { useVehicleProfile } from '@/libs/vehicle-profile';

import type { Route } from './+types/vehicle';

const BATTERY_HISTORY_DAYS = 7;

export function meta(_: Route.MetaArgs) {
  return [{ title: '차량 상태 | 차량 대시보드' }];
}

export async function loader({ context }: Route.LoaderArgs) {
  const collector = context.get(collectorContext);
  const [status, batteryHistory] = await Promise.all([
    collector.vehicle.status.query(),
    collector.vehicle.batteryHistory.query({ days: BATTERY_HISTORY_DAYS }),
  ]);

  return {
    measuredAt: status?.measuredAt ?? null,
    tpmsWarnLamp: status?.tpmsWarnLamp ?? false,
    tireReadings: toTireReadings(status),
    batteryReading: toBatteryReading(status),
    batteryHistory: toBatteryHistoryPoints(batteryHistory),
  };
}

export function ErrorBoundary() {
  return <DataLoadError title="차량 상태" />;
}

export default function Vehicle({ loaderData }: Route.ComponentProps) {
  const { measuredAt, tpmsWarnLamp, tireReadings, batteryReading, batteryHistory } = loaderData;
  const vehicleProfile = useVehicleProfile();
  const receivedVoltages = batteryHistory.flatMap((point) => (point.voltage === null ? [] : [point.voltage]));
  const averageVoltage = receivedVoltages.length
    ? (receivedVoltages.reduce((sum, voltage) => sum + voltage, 0) / receivedVoltages.length).toFixed(2)
    : '-';

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        actions={
          <HeaderPill icon={<CalendarIcon className="size-4" />}>
            {measuredAt ? `${formatKstDate(measuredAt)} 측정` : '수신 기록 없음'}
          </HeaderPill>
        }
        eyebrow={`${vehicleProfile.plateNumber} · ${vehicleProfile.model}`}
        title="차량 상태"
      />

      <Section
        description={tpmsWarnLamp ? 'TPMS 경고등이 켜져 있습니다' : '차량을 위에서 본 배치와 각 휠의 현재 공기압'}
        title="타이어 공기압"
      >
        <TirePressureDiagram readings={tireReadings} />
      </Section>

      <Section description="권장 공기압 대비 현재 값" title="타이어별 상세">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {tireReadings.map((tire) => (
            <StatCard
              hint={
                tire.pressurePsi === null
                  ? `권장 ${tire.recommendedPsi} psi · 센서 미수신`
                  : `권장 ${tire.recommendedPsi} psi · 편차 ${(tire.pressurePsi - tire.recommendedPsi).toFixed(1)}`
              }
              key={tire.position}
              label={tire.label}
              unit="psi"
              value={tire.pressurePsi === null ? '-' : tire.pressurePsi.toFixed(1)}
            />
          ))}
        </div>
      </Section>

      <Section description="최근 측정 전압과 최근 7일 시동 중 평균 전압" title="배터리">
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <BatteryGauge reading={batteryReading} />
          <ChartCard hint="최근 7일 평균" label="전압 추이" unit="V" value={averageVoltage}>
            <BatteryTrendChart data={batteryHistory} />
          </ChartCard>
        </div>
      </Section>
    </div>
  );
}
