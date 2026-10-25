import { Card, EmptyState, Skeleton, Tabs } from '@heroui/react';
import { useEffect, useState } from 'react';
import { useFetcher } from 'react-router';

import { ReplayGauges } from '@/components/ReplayGauges';
import { ReplayHeader } from '@/components/ReplayHeader';
import { ReplayTimeline } from '@/components/ReplayTimeline';
import { Section } from '@/components/Section';
import { formatKstTime } from '@/libs/datetime';
import { type ReplayRange, type ReplaySpeed, replayTotalMs, sampleReplay } from '@/libs/drive-replay';
import { cn } from '@/libs/utils';
import type { loader } from '@/routes/trips.replay';

const EMPTY_MESSAGES: Record<ReplayRange, string> = {
  last: '최근 주행 기록 없음',
  today: '오늘 주행 기록 없음',
};

export function DriveReplay() {
  const { data, state, load } = useFetcher<typeof loader>();
  const [range, setRange] = useState<ReplayRange>('last');
  const [speed, setSpeed] = useState<ReplaySpeed>(1);
  const [playing, setPlaying] = useState(false);
  const [positionMs, setPositionMs] = useState(0);

  const sessions = data?.sessions ?? [];
  const totalMs = replayTotalMs(sessions);
  const isPlaying = playing && positionMs < totalMs;
  const frame = sessions.length > 0 ? sampleReplay(sessions, positionMs) : null;

  useEffect(() => {
    load(`/trips/replay?range=${range}`);
  }, [load, range]);

  useEffect(() => {
    if (!isPlaying) return;

    let frameId = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      const elapsedMs = now - previous;
      previous = now;
      setPositionMs((current) => Math.min(current + elapsedMs * speed, totalMs));
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [isPlaying, speed, totalMs]);

  const changeRange = (next: ReplayRange) => {
    setPlaying(false);
    setPositionMs(0);
    setRange(next);
  };

  const togglePlay = () => {
    if (positionMs >= totalMs) {
      setPositionMs(0);
      setPlaying(true);
      return;
    }
    setPlaying(!isPlaying);
  };

  const seek = (nextMs: number) => {
    if (positionMs >= totalMs) setPlaying(false);
    setPositionMs(nextMs);
  };

  return (
    <Section
      action={
        <Tabs onSelectionChange={(key) => changeRange(key === 'today' ? 'today' : 'last')} selectedKey={range}>
          <Tabs.ListContainer>
            <Tabs.List aria-label="재생 범위">
              <Tabs.Tab className="whitespace-nowrap" id="last">
                최근 주행
                <Tabs.Indicator />
              </Tabs.Tab>
              <Tabs.Tab className="whitespace-nowrap" id="today">
                오늘 주행
                <Tabs.Indicator />
              </Tabs.Tab>
            </Tabs.List>
          </Tabs.ListContainer>
        </Tabs>
      }
      title="주행 재생"
    >
      {!data ? (
        <Skeleton className="h-[340px] w-full rounded-3xl" />
      ) : !frame ? (
        <Card className="p-3">
          <EmptyState className="py-10 text-sm text-[var(--muted)]">{EMPTY_MESSAGES[data.range]}</EmptyState>
        </Card>
      ) : (
        <Card className={cn('gap-6 p-5 transition-opacity', state === 'loading' && 'opacity-60')}>
          <ReplayHeader
            isPlaying={isPlaying}
            label={`주행 ${frame.sessionIndex + 1}/${sessions.length} · ${formatKstTime(frame.point.t)}`}
            onSpeedChange={setSpeed}
            onTogglePlay={togglePlay}
            speed={speed}
          />
          <ReplayGauges point={frame.point} />
          <ReplayTimeline onSeek={seek} positionMs={positionMs} sessions={sessions} />
        </Card>
      )}
    </Section>
  );
}
