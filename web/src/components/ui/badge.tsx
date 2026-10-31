import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'default' | 'accent' | 'outline' | 'solid';

interface Props extends HTMLAttributes<HTMLSpanElement> {
  variant?: Variant;
}

const variantCls: Record<Variant, string> = {
  default:
    'bg-[var(--color-muted)] text-[var(--color-foreground)] border-[var(--color-border)]',
  accent:
    'bg-[var(--color-accent-soft)] text-[var(--color-accent)] border-transparent',
  outline:
    'bg-transparent text-[var(--color-muted-foreground)] border-[var(--color-border)]',
  solid:
    'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] border-transparent',
};

export function Badge({ className, variant = 'default', ...rest }: Props) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium tracking-wide',
        variantCls[variant],
        className,
      )}
      {...rest}
    />
  );
}
