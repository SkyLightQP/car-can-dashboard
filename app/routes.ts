import { type RouteConfig, index, layout, route } from '@react-router/dev/routes';

export default [
  layout('layouts/dashboard-layout.tsx', [
    index('routes/dashboard.tsx'),
    route('vehicle', 'routes/vehicle.tsx'),
    route('trips', 'routes/trips.tsx'),
    route('maintenance', 'routes/maintenance.tsx'),
  ]),
] satisfies RouteConfig;
