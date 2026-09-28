import { useRouteLoaderData } from 'react-router';

import type { loader as dashboardLayoutLoader } from '@/layouts/dashboard-layout';
import type { VehicleProfile } from '@/types/dashboard';

export function useVehicleProfile(): VehicleProfile {
  const layoutData = useRouteLoaderData<typeof dashboardLayoutLoader>('layouts/dashboard-layout');

  if (!layoutData) {
    throw new Error('useVehicleProfile은 dashboard-layout 하위 경로에서만 쓸 수 있습니다.');
  }

  return layoutData.vehicleProfile;
}
