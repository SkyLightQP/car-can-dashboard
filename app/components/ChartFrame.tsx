import { Skeleton, useIsHydrated } from '@heroui/react';
import type { ReactNode } from 'react';

interface ChartFrameProps {
  height: number;
  children: ReactNode;
  label?: string;
}

/**
 * Recharts의 ResponsiveContainer는 서버 렌더링 시 폭이 0이라 하이드레이션 경고와
 * 레이아웃 점프를 일으킨다. 마운트 전에는 같은 높이의 스켈레톤을 그려서 막는다.
 */
export function ChartFrame({ height, children, label }: ChartFrameProps) {
  const isHydrated = useIsHydrated();

  if (!isHydrated) {
    return <Skeleton className="w-full rounded-2xl" style={{ height }} />;
  }

  return (
    <div aria-label={label} role={label ? 'img' : undefined} style={{ height }}>
      {children}
    </div>
  );
}
