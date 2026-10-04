import { Button, Drawer, useOverlayState } from '@heroui/react';
import { Outlet } from 'react-router';

import { CarIcon, MenuIcon } from '@/components/icons';
import { LogoutButton } from '@/components/logout-button';
import { SidebarNav } from '@/components/sidebar-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { requireCollectorSession } from '@/libs/auth.server';
import { readVehicleProfile } from '@/libs/vehicle-profile.server';

import type { Route } from './+types/dashboard-layout';

export const middleware: Route.MiddlewareFunction[] = [requireCollectorSession];

export function loader() {
  return { vehicleProfile: readVehicleProfile() };
}

function BrandMark() {
  return (
    <span
      aria-hidden
      className="flex size-11 items-center justify-center rounded-full bg-[var(--foreground)] text-[var(--background)]"
    >
      <CarIcon className="size-5" />
    </span>
  );
}

export default function DashboardLayout({ loaderData }: Route.ComponentProps) {
  const { vehicleProfile } = loaderData;
  const drawer = useOverlayState();

  return (
    <div className="app-canvas min-h-dvh">
      <div className="mx-auto flex w-full max-w-[1560px] gap-5 px-4 py-4 sm:px-6 sm:py-6 lg:gap-7 lg:px-7">
        {/* 데스크톱: 콘텐츠와 분리되어 떠 있는 아이콘 레일.
            position:sticky 는 그 자체로 쌓임 맥락을 만들어서, z-index 를 주지 않으면
            레일 안의 호버 라벨이 뒤따르는 카드 밑으로 깔린다. */}
        <aside className="sticky top-6 z-20 hidden h-[calc(100dvh-3rem)] shrink-0 flex-col items-center justify-between lg:flex">
          <div className="flex flex-col items-center gap-6">
            <BrandMark />
            <SidebarNav variant="rail" />
          </div>
          <div className="flex flex-col items-center gap-2.5">
            <LogoutButton variant="rail" />
            <ThemeToggle />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-5 sm:gap-6">
          {/* 모바일: 드로어 트리거가 있는 상단 바 */}
          <header className="flex items-center justify-between gap-3 lg:hidden">
            <Drawer state={drawer}>
              <Button aria-label="메뉴 열기" isIconOnly variant="tertiary">
                <MenuIcon className="size-5" />
              </Button>
              <Drawer.Backdrop>
                <Drawer.Content placement="left">
                  <Drawer.Dialog>
                    <Drawer.CloseTrigger />
                    <Drawer.Header>
                      <Drawer.Heading>{vehicleProfile.plateNumber}</Drawer.Heading>
                    </Drawer.Header>
                    <Drawer.Body>
                      <SidebarNav onNavigate={drawer.close} variant="list" />
                      <div className="mt-4 border-t border-[var(--separator)] pt-4">
                        <LogoutButton variant="list" />
                      </div>
                    </Drawer.Body>
                  </Drawer.Dialog>
                </Drawer.Content>
              </Drawer.Backdrop>
            </Drawer>
            <span className="truncate text-sm font-semibold">{vehicleProfile.plateNumber}</span>
            <ThemeToggle />
          </header>

          <main className="min-w-0 flex-1 pb-4">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
