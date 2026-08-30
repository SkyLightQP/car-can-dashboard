import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { TooltipValueType } from 'recharts';

import { ChartFrame } from '@/components/chart-frame';
import {
  axisProps,
  gridProps,
  tooltipContentStyle,
  tooltipItemStyle,
  tooltipLabelStyle,
} from '@/components/charts/chart-theme';
import type { WeeklyPoint } from '@/types/dashboard';

export function WeeklyTrendChart({ data }: { data: WeeklyPoint[] }) {
  return (
    <ChartFrame height={240} label="최근 6주 주간 주행거리 추이 차트">
      <ResponsiveContainer height="100%" width="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="weeklyDistanceFill" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.22} />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid {...gridProps} />
          <XAxis {...axisProps} dataKey="weekLabel" />
          <YAxis {...axisProps} width={48} />
          <Tooltip
            contentStyle={tooltipContentStyle}
            cursor={{ stroke: 'var(--chart-grid)', strokeDasharray: '4 4' }}
            formatter={(value: TooltipValueType | undefined) => [`${value} km`, '주간 주행거리']}
            itemStyle={tooltipItemStyle}
            labelStyle={tooltipLabelStyle}
          />
          <Area
            activeDot={{ r: 4, strokeWidth: 0 }}
            dataKey="distanceKm"
            fill="url(#weeklyDistanceFill)"
            stroke="var(--accent)"
            strokeWidth={2.5}
            type="monotone"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
