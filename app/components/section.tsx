import type { ReactNode } from 'react';

import { cn } from '@/libs/utils';

interface SectionProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Section({ title, description, action, children, className }: SectionProps) {
  return (
    <section className={cn('flex flex-col gap-3.5', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
          <h2 className="text-[15px] font-semibold tracking-tight">{title}</h2>
          {description ? <p className="text-xs text-[var(--muted)]">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
