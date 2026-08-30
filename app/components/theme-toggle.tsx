import { Button, useIsHydrated, useTheme } from '@heroui/react';

import { MoonIcon, SunIcon } from '@/components/icons';
import { cn } from '@/libs/utils';

export function ThemeToggle({ className }: { className?: string }) {
  const isHydrated = useIsHydrated();
  const { resolvedTheme, setTheme } = useTheme('light');

  // 하이드레이션 전에는 서버 마크업과 동일하게 라이트 상태로 그려 불일치를 피한다.
  const showDark = isHydrated && resolvedTheme === 'dark';

  return (
    <Button
      aria-label={showDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
      className={cn(
        'size-11 rounded-full bg-[var(--rail-surface)] text-[var(--muted)] shadow-[var(--surface-shadow)] hover:text-[var(--foreground)]',
        className
      )}
      isIconOnly
      onPress={() => setTheme(showDark ? 'light' : 'dark')}
      variant="tertiary"
    >
      {showDark ? <SunIcon className="size-5" /> : <MoonIcon className="size-5" />}
    </Button>
  );
}
