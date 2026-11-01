import { Fragment, type KeyboardEvent, type PointerEvent, useId, useMemo, useState } from 'react';

import { formatKstTime } from '@/libs/datetime';
import {
  formatGapLabel,
  replayDurationMs,
  replaySpeedCeilingKph,
  replayTotalMs,
  sampleReplay,
  SPEED_PATH_HEIGHT,
  SPEED_PATH_WIDTH,
  speedAreaPath,
} from '@/libs/drive-replay';
import type { DriveReplay } from '@/types/collector';

const KEY_STEP_MS = 5000;

interface ReplayTimelineProps {
  sessions: DriveReplay;
  positionMs: number;
  onSeek: (positionMs: number) => void;
}

interface HoverState {
  segmentIndex: number;
  ratio: number;
}

function pointerRatio(event: PointerEvent<HTMLDivElement>): number {
  const rect = event.currentTarget.getBoundingClientRect();
  return Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
}

export function ReplayTimeline({ sessions, positionMs, onSeek }: ReplayTimelineProps) {
  const clipIdPrefix = useId();
  const [hover, setHover] = useState<HoverState | null>(null);
  const totalMs = replayTotalMs(sessions);
  const { point } = sampleReplay(sessions, positionMs);

  const segments = useMemo(() => {
    const ceilingKph = replaySpeedCeilingKph(sessions);
    const durations = sessions.map(replayDurationMs);

    return sessions.map((session, index) => ({
      session,
      durationMs: durations[index],
      offsetMs: durations.slice(0, index).reduce((sum, durationMs) => sum + durationMs, 0),
      path: speedAreaPath(session, ceilingKph),
    }));
  }, [sessions]);

  const seekTo = (nextMs: number) => onSeek(Math.min(Math.max(nextMs, 0), totalMs));

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      seekTo(positionMs - KEY_STEP_MS);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      seekTo(positionMs + KEY_STEP_MS);
    }
  };

  const hoveredSegment = hover ? segments[hover.segmentIndex] : undefined;
  const hoverPoint =
    hover && hoveredSegment
      ? sampleReplay(sessions, hoveredSegment.offsetMs + hover.ratio * hoveredSegment.durationMs).point
      : null;

  return (
    <div
      aria-label="재생 위치"
      aria-valuemax={totalMs}
      aria-valuemin={0}
      aria-valuenow={Math.round(positionMs)}
      aria-valuetext={`${formatKstTime(point.t)} · ${Math.round(point.speedKph)} km/h`}
      className="flex items-end gap-1 rounded-md outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      onKeyDown={handleKeyDown}
      role="slider"
      tabIndex={0}
    >
      {segments.map(({ session, durationMs, offsetMs, path }, index) => {
        const playedRatio = Math.min(Math.max((positionMs - offsetMs) / durationMs, 0), 1);
        const clipId = `${clipIdPrefix}-played-${index}`;
        const hoverRatio = hover?.segmentIndex === index ? hover.ratio : null;

        return (
          <Fragment key={session.startedAt}>
            {index > 0 ? (
              <span className="min-w-0 self-center truncate px-1 text-[11px] whitespace-nowrap text-[var(--muted)]">
                ⋯ {formatGapLabel(Date.parse(session.startedAt) - Date.parse(sessions[index - 1].endedAt))} ⋯
              </span>
            ) : null}
            <div
              className="relative h-8 min-w-3 cursor-pointer touch-none"
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                const ratio = pointerRatio(event);
                setHover({ segmentIndex: index, ratio });
                seekTo(offsetMs + ratio * durationMs);
              }}
              onPointerLeave={() => setHover(null)}
              onPointerMove={(event) => {
                const ratio = pointerRatio(event);
                setHover({ segmentIndex: index, ratio });
                if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                  seekTo(offsetMs + ratio * durationMs);
                }
              }}
              onPointerUp={(event) => {
                if (event.pointerType !== 'mouse') setHover(null);
              }}
              style={{ flexGrow: durationMs, flexBasis: 0 }}
            >
              <div className="absolute inset-0 overflow-hidden rounded-md">
                <svg
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full"
                  preserveAspectRatio="none"
                  viewBox={`0 0 ${SPEED_PATH_WIDTH} ${SPEED_PATH_HEIGHT}`}
                >
                  <defs>
                    <clipPath id={clipId}>
                      <rect height={SPEED_PATH_HEIGHT} width={playedRatio * SPEED_PATH_WIDTH} />
                    </clipPath>
                  </defs>
                  <path d={path} fill="var(--chart-bar)" />
                  <path clipPath={`url(#${clipId})`} d={path} fill="var(--accent)" />
                </svg>
                <div className="absolute inset-x-0 bottom-0 h-[3px] bg-[var(--default)]">
                  <div className="h-full bg-[var(--accent)]" style={{ width: `${playedRatio * 100}%` }} />
                </div>
              </div>
              {hoverRatio !== null && hoverPoint ? (
                <>
                  <div
                    className="pointer-events-none absolute inset-y-0 w-px bg-[var(--foreground)] opacity-40"
                    style={{ left: `${hoverRatio * 100}%` }}
                  />
                  <div
                    className="pointer-events-none absolute bottom-full z-10 mb-2 flex flex-col items-center rounded-xl bg-[var(--overlay)] px-2.5 py-1.5 whitespace-nowrap shadow-[var(--overlay-shadow)]"
                    style={{ left: `${hoverRatio * 100}%`, transform: `translateX(-${hoverRatio * 100}%)` }}
                  >
                    <span className="text-[13px] font-semibold tabular-nums">
                      {Math.round(hoverPoint.speedKph)}
                      <span className="ml-0.5 text-[11px] font-normal text-[var(--muted)]">km/h</span>
                    </span>
                    <span className="text-[11px] text-[var(--muted)] tabular-nums">{formatKstTime(hoverPoint.t)}</span>
                  </div>
                </>
              ) : null}
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
