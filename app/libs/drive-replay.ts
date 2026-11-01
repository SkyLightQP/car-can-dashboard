import type { DriveReplay, DriveReplayPoint, DriveReplaySession } from '@/types/collector';

export type ReplayRange = 'last' | 'today';

export const REPLAY_SPEEDS = [1, 4, 16] as const;

export type ReplaySpeed = (typeof REPLAY_SPEEDS)[number];

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

export const SPEED_PATH_WIDTH = 1000;
export const SPEED_PATH_HEIGHT = 100;

export function replaySpeedCeilingKph(sessions: DriveReplay): number {
  const peak = sessions.reduce(
    (max, session) => session.points.reduce((sessionMax, point) => Math.max(sessionMax, point.speedKph), max),
    0
  );
  return Math.max(peak, 40);
}

export function speedAreaPath(session: DriveReplaySession, ceilingKph: number): string {
  const startMs = Date.parse(session.startedAt);
  const durationMs = replayDurationMs(session);
  const toX = (t: number) => (Math.min(Math.max((t - startMs) / durationMs, 0), 1) * SPEED_PATH_WIDTH).toFixed(1);
  const toY = (kph: number) =>
    (SPEED_PATH_HEIGHT - Math.min(Math.max(kph / ceilingKph, 0), 1) * SPEED_PATH_HEIGHT).toFixed(1);

  const line = session.points.map((point) => `L${toX(point.t)},${toY(point.speedKph)}`).join('');
  const firstX = session.points.length > 0 ? toX(session.points[0].t) : '0';
  const lastX = session.points.length > 0 ? toX(session.points[session.points.length - 1].t) : '0';

  return `M${firstX},${SPEED_PATH_HEIGHT}${line}L${lastX},${SPEED_PATH_HEIGHT}Z`;
}
