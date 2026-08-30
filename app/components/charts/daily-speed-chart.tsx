import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { ChartFrame } from '@/components/chart-frame';
import {
  axisProps,
  gridProps,
  tooltipContentStyle,
  tooltipItemStyle,
  tooltipLabelStyle,
} from '@/components/charts/chart-theme';
import type { DailyTrip } from '@/types/dashboard';

const legendStyle = { fontSize: 11, paddingTop: 8 };

export function DailySpeedChart({ data }: { data: DailyTrip[] }) {
  return (
    <ChartFrame height={260} label="최근 14일 일일 속도 차트">
      <ResponsiveContainer height="100%" width="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid {...gridProps} />
          <XAxis {...axisProps} dataKey="label" interval="preserveStartEnd" />
          <YAxis {...axisProps} unit="km/h" width={64} />
          <Tooltip
            contentStyle={tooltipContentStyle}
            cursor={{ stroke: 'var(--chart-grid)', strokeDasharray: '4 4' }}
            itemStyle={tooltipItemStyle}
            labelStyle={tooltipLabelStyle}
          />
          <Legend iconSize={8} iconType="circle" wrapperStyle={legendStyle} />
          <Line
            activeDot={{ r: 4, strokeWidth: 0 }}
            dataKey="avgSpeedKph"
            dot={false}
            name="평균 속도"
            stroke="var(--accent)"
            strokeWidth={2.5}
            type="monotone"
          />
          <Line
            activeDot={{ r: 4, strokeWidth: 0 }}
            dataKey="maxSpeedKph"
            dot={false}
            name="최고 속도"
            stroke="var(--chart-bar)"
            strokeWidth={2.5}
            type="monotone"
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
