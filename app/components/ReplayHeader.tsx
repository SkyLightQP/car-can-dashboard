import { Button, ToggleButton, ToggleButtonGroup } from '@heroui/react';

import { PauseIcon, PlayIcon } from '@/components/Icons';
import { REPLAY_SPEEDS, type ReplaySpeed } from '@/libs/drive-replay';

interface ReplayHeaderProps {
  label: string;
  isPlaying: boolean;
  speed: ReplaySpeed;
  onTogglePlay: () => void;
  onSpeedChange: (speed: ReplaySpeed) => void;
}

export function ReplayHeader({ label, isPlaying, speed, onTogglePlay, onSpeedChange }: ReplayHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="text-sm font-medium tabular-nums">{label}</span>
      <div className="flex items-center gap-2">
        <ToggleButtonGroup
          aria-label="재생 배속"
          disallowEmptySelection
          onSelectionChange={(keys) => {
            const next = REPLAY_SPEEDS.find((value) => keys.has(String(value)));
            if (next) onSpeedChange(next);
          }}
          selectedKeys={[String(speed)]}
          selectionMode="single"
          size="sm"
        >
          {REPLAY_SPEEDS.map((value, index) => (
            <ToggleButton id={String(value)} key={value}>
              {index > 0 ? <ToggleButtonGroup.Separator /> : null}
              {value}x
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <Button aria-label={isPlaying ? '일시정지' : '재생'} isIconOnly onPress={onTogglePlay} size="sm">
          {isPlaying ? <PauseIcon className="size-4" /> : <PlayIcon className="size-4" />}
        </Button>
      </div>
    </div>
  );
}
