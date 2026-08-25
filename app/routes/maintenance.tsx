import type { Route } from './+types/maintenance';

export function meta(_: Route.MetaArgs) {
  return [{ title: '정비 | 차량 대시보드' }];
}

export default function Maintenance() {
  return <h1 className="text-2xl font-semibold">정비</h1>;
}
