import { TrendDownIcon, TrendUpIcon } from '@/components/Icons';
import { cn } from '@/libs/utils';

interface TrendNoteProps {
  /** 증감률(%). 생략하면 아이콘 없이 설명만 나온다. */
  changePct?: number;
  /** 증감률 옆에 붙는 짧은 설명. */
  note?: string;
  className?: string;
}

/**
 * 참조 디자인의 "+10.5% Balance increase, good progress." 한 줄.
 * 작은 원형 아이콘 + 굵은 수치 + 흐린 설명 순서로 읽히게 한다.
 */
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
