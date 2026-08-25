import { Button, Drawer, useOverlayState } from '@heroui/react';
import { Outlet } from 'react-router';

import { MenuIcon } from '@/components/icons';
import { SidebarNav } from '@/components/sidebar-nav';
import { ThemeToggle } from '@/components/theme-toggle';
import { vehicleInfo } from '@/mocks/vehicle';

function SidebarBrand() {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-base font-semibold">{vehicleInfo.name}</span>
      <span className="text-[var(--foreground)]/60 text-xs">{vehicleInfo.model}</span>
    </div>
  );
}

export default function DashboardLayout() {
  const drawer = useOverlayState();

  return (
    <div className="flex min-h-dvh">
      <aside className="hidden w-64 shrink-0 flex-col justify-between border-r border-[var(--border)] p-4 lg:flex">
        <div className="flex flex-col gap-6">
          <SidebarBrand />
          <SidebarNav />
        </div>
        <div className="flex items-center justify-between rounded-xl px-1">
          <span className="text-[var(--foreground)]/60 text-xs">{vehicleInfo.plateNumber}</span>
          <ThemeToggle />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3 lg:hidden">
          <Drawer state={drawer}>
            <Button aria-label="메뉴 열기" isIconOnly variant="ghost">
              <MenuIcon className="size-5" />
            </Button>
            <Drawer.Backdrop>
              <Drawer.Content placement="left">
                <Drawer.Dialog>
                  <Drawer.CloseTrigger />
                  <Drawer.Header>
                    <Drawer.Heading>{vehicleInfo.name}</Drawer.Heading>
                  </Drawer.Header>
                  <Drawer.Body>
                    <SidebarNav onNavigate={drawer.close} />
                  </Drawer.Body>
                </Drawer.Dialog>
              </Drawer.Content>
            </Drawer.Backdrop>
          </Drawer>
          <span className="truncate text-sm font-semibold">{vehicleInfo.name}</span>
          <ThemeToggle />
        </header>

        <main className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
