import { TrendDownIcon, TrendUpIcon } from '@/components/Icons';
import { cn } from '@/libs/utils';

interface TrendNoteProps {
  changePct?: number;
  note?: string;
  className?: string;
}

export function TrendNote({ changePct, note, className }: TrendNoteProps) {
  const hasChange = typeof changePct === 'number';
  const isUp = hasChange && changePct >= 0;
  const Icon = isUp ? TrendUpIcon : TrendDownIcon;

  if (!hasChange && !note) return null;

  return (
    <div className={cn('flex items-center gap-2 text-xs', className)}>
      {hasChange ? (
        <>
          <span
            className={cn(
              'flex size-4 shrink-0 items-center justify-center rounded-full',
              isUp ? 'bg-[var(--success)]' : 'bg-[var(--danger)]'
            )}
          >
            <Icon
              className={cn('size-2.5', isUp ? 'text-[var(--success-foreground)]' : 'text-[var(--danger-foreground)]')}
              strokeWidth={2.5}
            />
          </span>
          <span className="font-medium tabular-nums">{`${isUp ? '+' : ''}${changePct.toFixed(1)}%`}</span>
        </>
      ) : null}
      {note ? <span className="min-w-0 truncate text-[var(--muted)]">{note}</span> : null}
    </div>
  );
}
