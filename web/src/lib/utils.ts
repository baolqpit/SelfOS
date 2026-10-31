import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(iso?: string | null, locale = 'vi-VN'): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  });
}

export function formatCurrency(
  amount: number | string | null | undefined,
  currency = 'VND',
): string {
  if (amount === null || amount === undefined || amount === '') return '';
  const n = typeof amount === 'string' ? Number(amount) : amount;
  if (Number.isNaN(n)) return '';
  try {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `${n} ${currency}`;
  }
}
