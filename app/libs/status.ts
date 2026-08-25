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
