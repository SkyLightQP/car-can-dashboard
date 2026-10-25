import type { DriveReplayPoint } from '@/types/collector';

const SPEED_MAX_KPH = 160;
const ACCEL_MAX_PCT = 100;
const BRAKE_MAX_BAR = 80;

interface PedalBarProps {
  label: string;
  value: number;
  max: number;
  display: string;
  unit: string;
  fill: string;
}

function PedalBar({ label, value, max, display, unit, fill }: PedalBarProps) {
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

export function ReplayGauges({ point }: { point: DriveReplayPoint }) {
  const speed = Math.round(point.speedKph);
  const speedRatio = Math.min(Math.max(point.speedKph / SPEED_MAX_KPH, 0), 1);
  const steering = point.steeringDeg.toFixed(0);

  return (
    <div className="grid grid-cols-2 items-end justify-items-center gap-6 sm:grid-cols-4">
      <div className="flex flex-col items-center gap-2">
        <svg aria-label={`속도 ${speed} km/h`} className="h-28 w-40" role="img" viewBox="0 0 100 62">
          <path
            d="M10 56 A40 40 0 0 1 90 56"
            fill="none"
            stroke="var(--default)"
            strokeLinecap="round"
            strokeWidth="8"
          />
          <path
            d="M10 56 A40 40 0 0 1 90 56"
            fill="none"
            pathLength={1}
            stroke="var(--accent)"
            strokeDasharray="1"
            strokeDashoffset={1 - speedRatio}
            strokeOpacity={speedRatio > 0 ? 1 : 0}
            strokeLinecap="round"
            strokeWidth="8"
          />
          <text fill="var(--foreground)" fontSize="20" fontWeight="600" textAnchor="middle" x="50" y="54">
            {speed}
          </text>
        </svg>
        <div className="flex flex-col items-center">
          <span className="text-[13px] text-[var(--muted)]">속도</span>
          <span className="text-xs text-[var(--muted)]">km/h</span>
        </div>
      </div>

      <PedalBar
        display={point.accelPct.toFixed(0)}
        fill="var(--success)"
        label="악셀"
        max={ACCEL_MAX_PCT}
        unit="%"
        value={point.accelPct}
      />

      <PedalBar
        display={point.brakeBar.toFixed(1)}
        fill="var(--danger)"
        label="브레이크"
        max={BRAKE_MAX_BAR}
        unit="bar"
        value={point.brakeBar}
      />

      <div className="flex flex-col items-center gap-2">
        <svg aria-label={`조향 ${steering}°`} className="size-28" role="img" viewBox="0 0 64 64">
          <g stroke="var(--foreground)" strokeLinecap="round" transform={`rotate(${point.steeringDeg} 32 32)`}>
            <circle cx="32" cy="32" fill="none" r="26" strokeWidth="5" />
            <circle cx="32" cy="32" fill="var(--foreground)" r="5" stroke="none" />
            <path d="M6 32h21M37 32h21M32 37v21" strokeWidth="4.5" />
            <circle cx="32" cy="6" fill="var(--accent)" r="3" stroke="none" />
          </g>
        </svg>
        <div className="flex flex-col items-center">
          <span className="text-[13px] text-[var(--muted)]">조향</span>
          <span className="text-lg font-semibold tabular-nums">{steering}°</span>
        </div>
      </div>
    </div>
  );
}
