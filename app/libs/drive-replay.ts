import type { DriveReplay, DriveReplayPoint, DriveReplaySession } from '@/types/collector';

export type ReplayRange = 'last' | 'today';

export const REPLAY_SPEEDS = [1, 4, 16] as const;

const MIN_SESSION_MS = 1000;
const MINUTE_MS = 60_000;

export function replayDurationMs(session: DriveReplaySession): number {
  return Math.max(Date.parse(session.endedAt) - Date.parse(session.startedAt), MIN_SESSION_MS);
}

export function replayTotalMs(sessions: DriveReplay): number {
  return sessions.reduce((sum, session) => sum + replayDurationMs(session), 0);
}

export function sampleReplay(
  sessions: DriveReplay,
  positionMs: number
): { sessionIndex: number; point: DriveReplayPoint } {
  let remainingMs = Math.min(Math.max(positionMs, 0), replayTotalMs(sessions));
  let sessionIndex = 0;

  while (sessionIndex < sessions.length - 1 && remainingMs >= replayDurationMs(sessions[sessionIndex])) {
    remainingMs -= replayDurationMs(sessions[sessionIndex]);
    sessionIndex += 1;
  }

  const { points, startedAt } = sessions[sessionIndex];
  const time = Date.parse(startedAt) + remainingMs;
  const nextIndex = points.findIndex((point) => point.t >= time);

  if (nextIndex === -1) {
    return { sessionIndex, point: points[points.length - 1] };
  }
  if (nextIndex === 0) {
    return { sessionIndex, point: points[0] };
  }

  const before = points[nextIndex - 1];
  const after = points[nextIndex];
  const ratio = (time - before.t) / (after.t - before.t);
  const lerp = (from: number, to: number) => from + (to - from) * ratio;

  return {
    sessionIndex,
    point: {
      t: time,
      speedKph: lerp(before.speedKph, after.speedKph),
      accelPct: lerp(before.accelPct, after.accelPct),
      brakeBar: lerp(before.brakeBar, after.brakeBar),
      steeringDeg: lerp(before.steeringDeg, after.steeringDeg),
    },
  };
}

export function formatGapLabel(gapMs: number): string {
  const totalMinutes = Math.max(Math.round(gapMs / MINUTE_MS), 1);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0) {
    return `${minutes}분`;
  }
  return minutes === 0 ? `${hours}시간` : `${hours}시간 ${minutes}분`;
}
