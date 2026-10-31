'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const variantCls: Record<ButtonVariant, string> = {
  primary:
    'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:opacity-90',
  secondary: 'bg-[var(--color-muted)] text-[var(--color-foreground)] hover:bg-[var(--color-muted)]/80',
  ghost: 'bg-transparent hover:bg-[var(--color-muted)]',
  outline:
    'bg-transparent border border-[var(--color-border)] hover:bg-[var(--color-muted)]',
  destructive: 'bg-[var(--color-destructive)] text-white hover:opacity-90',
};

const sizeCls: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-6 text-base',
  icon: 'h-9 w-9',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...rest }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-md font-medium transition disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40',
        variantCls[variant],
        sizeCls[size],
        className,
      )}
      {...rest}
    >
      {loading ? <span className="animate-pulse">…</span> : children}
    </button>
  ),
);
Button.displayName = 'Button';
