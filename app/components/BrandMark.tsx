import { CarIcon } from '@/components/Icons';

export function BrandMark() {
  return (
    <span
      aria-hidden
      className="flex size-11 items-center justify-center rounded-full bg-[var(--foreground)] text-[var(--background)]"
    >
      <CarIcon className="size-5" />
    </span>
  );
}
