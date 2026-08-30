import { BatteryGauge } from '@/components/battery-gauge';
import { ChartCard } from '@/components/chart-card';
import { BatteryTrendChart } from '@/components/charts/battery-trend-chart';
import { CalendarIcon } from '@/components/icons';
import { HeaderPill, PageHeader } from '@/components/page-header';
import { Section } from '@/components/section';
import { StatCard } from '@/components/stat-card';
import { TirePressureDiagram } from '@/components/tire-pressure-diagram';
import { formatKstDate } from '@/libs/datetime';
import { batteryHistory, batteryReading, tireReadings, vehicleInfo } from '@/mocks/vehicle';

import type { Route } from './+types/vehicle';

export function meta(_: Route.MetaArgs) {
  return [{ title: '차량 상태 | 차량 대시보드' }];
}

const measuredDate = formatKstDate(batteryReading.measuredAt);
const averageVoltage = batteryHistory.length
  ? (batteryHistory.reduce((sum, point) => sum + point.voltage, 0) / batteryHistory.length).toFixed(2)
  : '—';

export default function Vehicle() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        actions={<HeaderPill icon={<CalendarIcon className="size-4" />}>{measuredDate} 측정</HeaderPill>}
        eyebrow={`${vehicleInfo.plateNumber} · ${vehicleInfo.model}`}
        title="차량 상태"
      />

      <Section description="차량을 위에서 본 배치와 각 휠의 현재 공기압" title="타이어 공기압">
        <TirePressureDiagram readings={tireReadings} />
      </Section>

      <Section description="권장 공기압 대비 현재 값" title="타이어별 상세">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {tireReadings.map((tire) => (
            <StatCard
              hint={`권장 ${tire.recommendedPsi} psi · 편차 ${(tire.pressurePsi - tire.recommendedPsi).toFixed(1)}`}
              key={tire.position}
              label={tire.label}
              unit="psi"
              value={tire.pressurePsi.toFixed(1)}
            />
          ))}
        </div>
      </Section>

      <Section description="시동 전 기준 전압과 최근 7일 추이" title="배터리">
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
