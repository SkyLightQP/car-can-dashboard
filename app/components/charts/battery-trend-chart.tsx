import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { TooltipValueType } from 'recharts';

import { ChartFrame } from '@/components/chart-frame';
import {
  axisProps,
  gridProps,
  tooltipContentStyle,
  tooltipItemStyle,
  tooltipLabelStyle,
} from '@/components/charts/chart-theme';
import type { BatteryHistoryPoint } from '@/types/dashboard';

export function BatteryTrendChart({ data }: { data: BatteryHistoryPoint[] }) {
  return (
    <ChartFrame height={180} label="최근 7일 배터리 전압 추이 차트">
      <ResponsiveContainer height="100%" width="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid {...gridProps} />
          <XAxis {...axisProps} dataKey="label" />
          <YAxis {...axisProps} domain={[11.5, 13]} unit="V" width={56} />
          <Tooltip
            contentStyle={tooltipContentStyle}
            cursor={{ stroke: 'var(--chart-grid)', strokeDasharray: '4 4' }}
            formatter={(value: TooltipValueType | undefined) => [`${value} V`, '전압']}
            itemStyle={tooltipItemStyle}
            labelStyle={tooltipLabelStyle}
          />
          <Line
            activeDot={{ r: 4, strokeWidth: 0 }}
            dataKey="voltage"
            dot={{ r: 2.5, strokeWidth: 0 }}
            stroke="var(--success)"
            strokeWidth={2.5}
            type="monotone"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
