'use client';

import { cn } from '@/lib/utils';

interface SwitchProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  id?: string;
}

export function Switch({ checked, onChange, disabled, id }: SwitchProps) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition',
        checked
          ? 'bg-[var(--color-primary)] border-[var(--color-primary)]'
          : 'bg-[var(--color-muted)] border-[var(--color-border)]',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
    >
      <span
        className={cn(
          'inline-block h-5 w-5 rounded-full bg-white shadow transition-transform',
          checked ? 'translate-x-5' : 'translate-x-1',
        )}
      />
    </button>
  );
}
