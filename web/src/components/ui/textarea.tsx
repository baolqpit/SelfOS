'use client';

import { TextareaHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...rest }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-20 w-full rounded-md border border-[var(--color-border)] bg-transparent px-3 py-2 text-sm',
        'placeholder:text-[var(--color-muted-foreground)]',
        'focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...rest}
    />
  ),
);
Textarea.displayName = 'Textarea';
