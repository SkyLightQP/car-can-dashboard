import type { Route } from './+types/trips';

export function meta(_: Route.MetaArgs) {
  return [{ title: '주행 기록 | 차량 대시보드' }];
}

export default function Trips() {
  return <h1 className="text-2xl font-semibold">주행 기록</h1>;
}
