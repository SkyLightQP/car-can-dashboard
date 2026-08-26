import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { TooltipValueType } from 'recharts';

import { ChartFrame } from '@/components/chart-frame';
import type { DailyTrip } from '@/types/dashboard';

const axisStyle = { fill: 'var(--foreground)', fillOpacity: 0.6, fontSize: 12 };

const tooltipStyle = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 12,
  color: 'var(--foreground)',
  fontSize: 12,
};

export function DailyDistanceChart({ data }: { data: DailyTrip[] }) {
  return (
    <ChartFrame height={260} label="최근 14일 일일 주행거리 차트">
      <ResponsiveContainer height="100%" width="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid stroke="var(--separator)" strokeDasharray="3 3" vertical={false} />
          <XAxis axisLine={false} dataKey="label" tick={axisStyle} tickLine={false} />
          <YAxis axisLine={false} tick={axisStyle} tickLine={false} width={44} />
          <Tooltip
            contentStyle={tooltipStyle}
            cursor={{ fill: 'var(--foreground)', fillOpacity: 0.06 }}
            formatter={(value: TooltipValueType | undefined) => [`${value} km`, '주행거리']}
          />
          <Bar dataKey="distanceKm" fill="var(--accent)" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
