/**
 * 차트 4종이 같은 톤을 쓰도록 모아 둔 recharts 프리셋.
 * 축·격자는 최대한 흐리게, 데이터만 남기는 참조 디자인의 방향을 따른다.
 */

export const axisTick = {
  fill: 'var(--muted)',
  fontSize: 11,
} as const;

export const axisProps = {
  axisLine: false,
  tick: axisTick,
  tickLine: false,
  tickMargin: 8,
} as const;

export const gridProps = {
  stroke: 'var(--chart-grid)',
  strokeDasharray: '2 6',
  vertical: false,
} as const;

export const tooltipContentStyle = {
  background: 'var(--overlay)',
  border: 'none',
  borderRadius: 16,
  boxShadow: 'var(--overlay-shadow)',
  color: 'var(--foreground)',
  fontSize: 12,
  padding: '10px 12px',
} as const;

export const tooltipLabelStyle = {
  color: 'var(--muted)',
  fontSize: 11,
  marginBottom: 4,
} as const;

export const tooltipItemStyle = {
  color: 'var(--foreground)',
  fontSize: 13,
  fontWeight: 600,
  padding: 0,
} as const;

export const barCursor = {
  fill: 'var(--foreground)',
  fillOpacity: 0.04,
  radius: 12,
} as const;

/** 최댓값 막대만 프라이머리로 강조하고 나머지는 중성색으로 눕힌다. */
export function barFill(isPeak: boolean) {
  return isPeak ? 'var(--accent)' : 'var(--chart-bar)';
}
