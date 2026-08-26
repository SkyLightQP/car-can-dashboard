import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { TooltipValueType } from 'recharts';

import { ChartFrame } from '@/components/chart-frame';
import type { BatteryHistoryPoint } from '@/types/dashboard';

const axisStyle = { fill: 'var(--foreground)', fillOpacity: 0.6, fontSize: 12 };

const tooltipStyle = {
  background: 'var(--surface)',
  border: '1px solid var(--border)',
  borderRadius: 12,
  color: 'var(--foreground)',
  fontSize: 12,
};

export function BatteryTrendChart({ data }: { data: BatteryHistoryPoint[] }) {
  return (
    <ChartFrame height={180}>
      <ResponsiveContainer height="100%" width="100%">
        <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="var(--separator)" strokeDasharray="3 3" vertical={false} />
          <XAxis axisLine={false} dataKey="label" tick={axisStyle} tickLine={false} />
          <YAxis axisLine={false} domain={[11.5, 13]} tick={axisStyle} tickLine={false} unit="V" width={60} />
          <Tooltip
            contentStyle={tooltipStyle}
            formatter={(value: TooltipValueType | undefined) => [`${value} V`, '전압']}
          />
          <Line dataKey="voltage" dot={{ r: 3 }} stroke="var(--success)" strokeWidth={2} type="monotone" />
        </LineChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
