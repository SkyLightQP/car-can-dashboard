import type { ReactNode } from 'react';
import { Link } from 'react-router';

export function PillLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link
      className="flex h-9 items-center gap-1.5 rounded-full bg-[var(--foreground)]/[0.06] px-4 text-xs font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--foreground)]/[0.11] focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:outline-none"
      to={to}
    >
      {children}
    </Link>
  );
}
