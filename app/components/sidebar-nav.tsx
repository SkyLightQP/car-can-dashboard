import type { ComponentType, SVGProps } from 'react';
import { NavLink } from 'react-router';

import { CarIcon, GaugeIcon, RouteIcon, WrenchIcon } from '@/components/icons';
import { cn } from '@/libs/utils';

interface NavItem {
  to: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}

const navItems: NavItem[] = [
  { to: '/', label: '대시보드', Icon: GaugeIcon },
  { to: '/vehicle', label: '차량 상태', Icon: CarIcon },
  { to: '/trips', label: '주행 기록', Icon: RouteIcon },
  { to: '/maintenance', label: '정비', Icon: WrenchIcon },
];

interface SidebarNavProps {
  onNavigate?: () => void;
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  return (
    <nav aria-label="주요 메뉴" className="flex flex-col gap-1">
      {navItems.map(({ to, label, Icon }) => (
        <NavLink
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
                : 'text-[var(--foreground)]/70 hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]'
            )
          }
          end={to === '/'}
          key={to}
          onClick={onNavigate}
          to={to}
        >
          <Icon className="size-5 shrink-0" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
