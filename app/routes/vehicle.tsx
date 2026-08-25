import type { Route } from './+types/vehicle';

export function meta(_: Route.MetaArgs) {
  return [{ title: '차량 상태 | 차량 대시보드' }];
}

export default function Vehicle() {
  return <h1 className="text-2xl font-semibold">차량 상태</h1>;
}
