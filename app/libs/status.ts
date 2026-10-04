import type { StatusLevel } from '@/types/dashboard';

export function statusChipColor(status: StatusLevel): 'success' | 'warning' | 'danger' {
  if (status === 'critical') return 'danger';
  if (status === 'warning') return 'warning';
  return 'success';
}

export function statusLabel(status: StatusLevel): string {
  if (status === 'critical') return '점검 필요';
  if (status === 'warning') return '주의';
  return '정상';
}

const statusRank: Record<StatusLevel, number> = {
  critical: 0,
  warning: 1,
  normal: 2,
};

const UNKNOWN_STATUS_RANK = 3;

function rankOf(status: StatusLevel | null): number {
  return status === null ? UNKNOWN_STATUS_RANK : statusRank[status];
}

/** 심각도 오름차순 정렬용 비교 함수. critical 이 가장 앞에 온다. */
export function compareByStatus(a: { status: StatusLevel | null }, b: { status: StatusLevel | null }): number {
  return rankOf(a.status) - rankOf(b.status);
}
