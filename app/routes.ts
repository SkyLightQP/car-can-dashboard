import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';

export default [
  route('login', 'routes/login.tsx'),
  route('logout', 'routes/logout.tsx'),
  layout('layouts/dashboard-layout.tsx', [
    index('routes/dashboard.tsx'),
    route('vehicle', 'routes/vehicle.tsx'),
    route('trips', 'routes/trips.tsx'),
    route('trips/replay', 'routes/trips.replay.ts'),
    route('maintenance', 'routes/maintenance.tsx'),
    route('settings', 'routes/settings.tsx'),
  ]),
] satisfies RouteConfig;
