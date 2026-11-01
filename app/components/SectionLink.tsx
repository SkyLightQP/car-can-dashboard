import type { ReactNode } from 'react';
import { Link } from 'react-router';

import { ArrowRightIcon } from '@/components/Icons';

export function SectionLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      className="flex items-center gap-1 rounded-full bg-[var(--surface)] px-3 py-1.5 text-xs font-medium text-[var(--muted)] shadow-[var(--surface-shadow)] transition-colors hover:text-[var(--foreground)]"
      to={to}
    >
      {children}
      <ArrowRightIcon className="size-3.5" />
    </Link>
  );
}
