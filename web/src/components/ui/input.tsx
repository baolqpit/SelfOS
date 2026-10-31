'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...rest }, ref) => (
    <input
      ref={ref}
      className={cn(
        'flex h-10 w-full rounded-md border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm',
        'placeholder:text-[var(--color-muted-foreground)]',
        'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...rest}
    />
  ),
);
Input.displayName = 'Input';
