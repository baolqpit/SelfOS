import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Label } from './label';

interface FieldProps extends HTMLAttributes<HTMLDivElement> {
  label: string;
  hint?: string;
  error?: string;
  htmlFor?: string;
  children: ReactNode;
}

export function Field({ label, hint, error, htmlFor, children, className, ...rest }: FieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)} {...rest}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {hint && !error && <p className="text-xs text-[var(--color-muted-foreground)]">{hint}</p>}
      {error && <p className="text-xs text-[var(--color-destructive)]">{error}</p>}
    </div>
  );
}
