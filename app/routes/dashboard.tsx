import type { Route } from './+types/dashboard';

export function meta(_: Route.MetaArgs) {
  return [{ title: '대시보드 | 차량 대시보드' }];
}

export default function Dashboard() {
  return <h1 className="text-2xl font-semibold">대시보드</h1>;
}
