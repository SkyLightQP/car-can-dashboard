import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { TooltipValueType } from 'recharts';

import { ChartFrame } from '@/components/chart-frame';
import type { WeeklyPoint } from '@/types/dashboard';

const axisStyle = { fill: 'var(--foreground)', fillOpacity: 0.6, fontSize: 12 };

const tooltipStyle = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 12,
  color: 'var(--foreground)',
  fontSize: 12,
};

export function WeeklyTrendChart({ data }: { data: WeeklyPoint[] }) {
  return (
    <ChartFrame height={240}>
      <ResponsiveContainer height="100%" width="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <defs>
            <linearGradient id="weeklyDistanceFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--separator)" strokeDasharray="3 3" vertical={false} />
          <XAxis axisLine={false} dataKey="weekLabel" tick={axisStyle} tickLine={false} />
          <YAxis axisLine={false} tick={axisStyle} tickLine={false} width={52} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value: TooltipValueType | undefined) => [`${value} km`, '주간 주행거리']}
          />
          <Area
            dataKey="distanceKm"
            fill="url(#weeklyDistanceFill)"
            stroke="var(--accent)"
            strokeWidth={2}
            type="monotone"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
