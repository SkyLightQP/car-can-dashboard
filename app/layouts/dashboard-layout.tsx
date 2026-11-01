import { Button, Drawer, useOverlayState } from '@heroui/react';
import { Outlet } from 'react-router';

import { BrandMark } from '@/components/BrandMark';
import { MenuIcon } from '@/components/Icons';
import { LogoutButton } from '@/components/LogoutButton';
import { SidebarNav } from '@/components/SidebarNav';
import { ThemeToggle } from '@/components/ThemeToggle';
import { requireCollectorSession } from '@/libs/auth.server';
import { readVehicleProfile } from '@/libs/vehicle-profile.server';

import type { Route } from './+types/dashboard-layout';

export const middleware: Route.MiddlewareFunction[] = [requireCollectorSession];

export function loader() {
  return { vehicleProfile: readVehicleProfile() };
}

export default function DashboardLayout({ loaderData }: Route.ComponentProps) {
  const { vehicleProfile } = loaderData;
  const drawer = useOverlayState();

  return (
    <div className="app-canvas min-h-dvh">
      <div className="mx-auto flex w-full max-w-[1560px] gap-5 px-4 py-4 sm:px-6 sm:py-6 lg:gap-7 lg:px-7">
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
