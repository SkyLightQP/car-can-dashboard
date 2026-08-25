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
    <section className={cn('flex flex-col gap-4', className)}>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">{title}</h2>
          {description ? <p className="text-[var(--foreground)]/60 text-sm">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}
