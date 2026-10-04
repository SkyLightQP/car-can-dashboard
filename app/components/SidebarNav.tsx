import type { ComponentType, SVGProps } from 'react';
import { NavLink } from 'react-router';

import { CarIcon, GaugeIcon, RouteIcon, WrenchIcon } from '@/components/Icons';
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
  /** rail: 떠 있는 원형 아이콘 레일(데스크톱). list: 라벨이 보이는 목록(드로어). */
  variant?: 'rail' | 'list';
  onNavigate?: () => void;
}

export function SidebarNav({ variant = 'list', onNavigate }: SidebarNavProps) {
  if (variant === 'rail') {
    return (
      <nav aria-label="주요 메뉴" className="flex flex-col items-center gap-2.5">
        {navItems.map(({ to, label, Icon }) => (
          <NavLink
            className={({ isActive }) =>
              cn(
                'group relative flex size-11 items-center justify-center rounded-full shadow-[var(--surface-shadow)] transition-colors',
                isActive
                  ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
                  : 'bg-[var(--rail-surface)] text-[var(--muted)] hover:text-[var(--foreground)]'
              )
            }
            end={to === '/'}
            key={to}
            onClick={onNavigate}
            to={to}
          >
            <Icon className="size-5" />
            {/* 호버·포커스 시에만 오른쪽으로 펼쳐지는 라벨 */}
            <span className="pointer-events-none absolute left-full z-10 ml-2 hidden rounded-full bg-[var(--foreground)] px-2.5 py-1 text-xs font-medium whitespace-nowrap text-[var(--background)] opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100 lg:block">
              {label}
            </span>
          </NavLink>
        ))}
      </nav>
    );
  }

  return (
    <nav aria-label="주요 메뉴" className="flex flex-col gap-1">
      {navItems.map(({ to, label, Icon }) => (
        <NavLink
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-medium transition-colors',
              isActive
                ? 'bg-[var(--accent)] text-[var(--accent-foreground)]'
                : 'text-[var(--muted)] hover:bg-[var(--surface-hover)] hover:text-[var(--foreground)]'
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
