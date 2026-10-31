import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export function Badge({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border border-[var(--color-border)] bg-[var(--color-muted)]/60 px-2.5 py-0.5 text-xs',
        className,
      )}
      {...rest}
    />
  );
}
