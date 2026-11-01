import type { ReactNode } from 'react';

export function HeaderPill({ icon, children }: { icon?: ReactNode; children: ReactNode }) {
  return (
    <span className="flex h-9 items-center gap-2 rounded-full bg-[var(--surface)] px-3.5 text-xs font-medium text-[var(--muted)] shadow-[var(--surface-shadow)]">
      {icon}
      {children}
    </span>
  );
}
