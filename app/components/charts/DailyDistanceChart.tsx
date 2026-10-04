import { Bar, BarChart, CartesianGrid, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { BarShapeProps, TooltipValueType } from 'recharts';

import { ChartFrame } from '@/components/ChartFrame';
import {
  axisProps,
  barCursor,
  barFill,
  gridProps,
  tooltipContentStyle,
  tooltipItemStyle,
  tooltipLabelStyle,
} from '@/components/charts/chart-theme';
import type { DailyTrip } from '@/types/dashboard';

/** recharts 의 payload 는 any 라서, 이 차트가 실제로 읽는 필드만 좁혀 둔다. */
interface DistanceBarProps extends Omit<BarShapeProps, 'payload'> {
  payload?: DailyTrip;
}

export function DailyDistanceChart({ data }: { data: DailyTrip[] }) {
  const peak = data.length ? Math.max(...data.map((trip) => trip.distanceKm)) : 0;

  // 최댓값 하루만 프라이머리로 세우고 나머지는 중성색으로 눕힌다.
  const renderBar = ({ payload, ...rest }: DistanceBarProps) => (
    <Rectangle {...rest} fill={barFill(peak > 0 && payload?.distanceKm === peak)} radius={[8, 8, 8, 8]} />
  );

  return (
    <ChartFrame height={260} label="최근 14일 일일 주행거리 차트">
      <ResponsiveContainer height="100%" width="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid {...gridProps} />
          <XAxis {...axisProps} dataKey="label" interval="preserveStartEnd" />
          <YAxis {...axisProps} width={44} />
          <Tooltip
            contentStyle={tooltipContentStyle}
            cursor={barCursor}
            formatter={(value: TooltipValueType | undefined) => [`${value} km`, '주행거리']}
            itemStyle={tooltipItemStyle}
            labelStyle={tooltipLabelStyle}
          />
          <Bar dataKey="distanceKm" shape={renderBar} />
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}
