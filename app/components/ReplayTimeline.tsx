import { Fragment, type KeyboardEvent, type PointerEvent } from 'react';

import { formatKstTime } from '@/libs/datetime';
import { formatGapLabel, replayDurationMs, replayTotalMs, sampleReplay } from '@/libs/drive-replay';
import type { DriveReplay } from '@/types/collector';

const KEY_STEP_MS = 5000;

interface ReplayTimelineProps {
  sessions: DriveReplay;
  positionMs: number;
  onSeek: (positionMs: number) => void;
}

export function ReplayTimeline({ sessions, positionMs, onSeek }: ReplayTimelineProps) {
  const totalMs = replayTotalMs(sessions);
  const { point } = sampleReplay(sessions, positionMs);
  const segments = sessions.map((session, index) => ({
    session,
    durationMs: replayDurationMs(session),
    offsetMs: sessions.slice(0, index).reduce((sum, previous) => sum + replayDurationMs(previous), 0),
  }));

  const seekTo = (nextMs: number) => onSeek(Math.min(Math.max(nextMs, 0), totalMs));

  const seekWithin = (event: PointerEvent<HTMLDivElement>, offsetMs: number, durationMs: number) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = Math.min(Math.max((event.clientX - rect.left) / rect.width, 0), 1);
    seekTo(offsetMs + ratio * durationMs);
  };

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

  return (
    <div
      aria-label="재생 위치"
      aria-valuemax={totalMs}
      aria-valuemin={0}
      aria-valuenow={Math.round(positionMs)}
      aria-valuetext={formatKstTime(point.t)}
      className="flex items-center gap-1 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      onKeyDown={handleKeyDown}
      role="slider"
      tabIndex={0}
    >
      {segments.map(({ session, durationMs, offsetMs }, index) => {
        const playedRatio = Math.min(Math.max((positionMs - offsetMs) / durationMs, 0), 1);

        return (
          <Fragment key={session.startedAt}>
            {index > 0 ? (
              <span className="shrink-0 px-1 text-[11px] whitespace-nowrap text-[var(--muted)]">
                ⋯ {formatGapLabel(Date.parse(session.startedAt) - Date.parse(sessions[index - 1].endedAt))} ⋯
              </span>
            ) : null}
            <div
              className="relative h-3 min-w-3 cursor-pointer touch-none overflow-hidden rounded-full bg-[var(--default)]"
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                seekWithin(event, offsetMs, durationMs);
              }}
              onPointerMove={(event) => {
                if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                  seekWithin(event, offsetMs, durationMs);
                }
              }}
              style={{ flexGrow: durationMs, flexBasis: 0 }}
            >
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-[var(--accent)]"
                style={{ width: `${playedRatio * 100}%` }}
              />
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
