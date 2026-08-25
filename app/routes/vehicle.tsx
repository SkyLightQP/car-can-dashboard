import { Card } from '@heroui/react';

import { BatteryGauge } from '@/components/battery-gauge';
import { BatteryTrendChart } from '@/components/charts/battery-trend-chart';
import { Section } from '@/components/section';
import { StatCard } from '@/components/stat-card';
import { TirePressureDiagram } from '@/components/tire-pressure-diagram';
import { batteryHistory, batteryReading, tireReadings, vehicleInfo } from '@/mocks/vehicle';

import type { Route } from './+types/vehicle';

export function meta(_: Route.MetaArgs) {
  return [{ title: '차량 상태 | 차량 대시보드' }];
}

export default function Vehicle() {
  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold">차량 상태</h1>
        <p className="text-[var(--foreground)]/60 text-sm">
          {vehicleInfo.model} · {vehicleInfo.plateNumber}
        </p>
      </header>

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

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Section description="시동 전 기준" title="배터리 전압">
          <BatteryGauge reading={batteryReading} />
        </Section>
        <Section description="최근 7일" title="전압 추이">
          <Card className="p-4">
            <BatteryTrendChart data={batteryHistory} />
          </Card>
        </Section>
      </div>
    </div>
  );
}
