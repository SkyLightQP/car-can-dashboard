interface PedalBarProps {
  label: string;
  value: number;
  max: number;
  display: string;
  unit: string;
  fill: string;
}

export function PedalBar({ label, value, max, display, unit, fill }: PedalBarProps) {
  const ratio = Math.min(Math.max(value / max, 0), 1);

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        aria-label={`${label} ${display} ${unit}`}
        aria-valuemax={max}
        aria-valuemin={0}
        aria-valuenow={value}
        className="relative h-28 w-7 overflow-hidden rounded-full bg-[var(--default)]"
        role="meter"
      >
        <div
          className="absolute inset-x-0 bottom-0 rounded-full"
          style={{ height: `${ratio * 100}%`, background: fill }}
        />
      </div>
      <div className="flex flex-col items-center">
        <span className="text-[13px] text-[var(--muted)]">{label}</span>
        <span className="text-lg font-semibold tabular-nums">
          {display}
          <span className="ml-0.5 text-xs font-normal text-[var(--muted)]">{unit}</span>
        </span>
      </div>
    </div>
  );
}
