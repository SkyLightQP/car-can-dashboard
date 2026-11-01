import { Skeleton, useIsHydrated } from '@heroui/react';
import type { ReactNode } from 'react';

interface ChartFrameProps {
  height: number;
  children: ReactNode;
  label?: string;
}

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
