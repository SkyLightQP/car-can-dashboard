import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

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

export function DailySpeedChart({ data }: { data: DailyTrip[] }) {
  return (
    <ChartFrame height={260}>
      <ResponsiveContainer height="100%" width="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid stroke="var(--separator)" strokeDasharray="3 3" vertical={false} />
          <XAxis axisLine={false} dataKey="label" tick={axisStyle} tickLine={false} />
          <YAxis axisLine={false} tick={axisStyle} tickLine={false} unit="km/h" width={62} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Line dataKey="avgSpeedKph" dot={false} name="평균 속도" stroke="var(--accent)" strokeWidth={2} />
          <Line dataKey="maxSpeedKph" dot={false} name="최고 속도" stroke="var(--warning)" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
