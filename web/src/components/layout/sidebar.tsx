'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  User,
  Briefcase,
  BookOpen,
  Calendar,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  { href: '/dashboard', label: 'Overview', icon: Home },
  { href: '/dashboard/profile', label: 'Profile', icon: User },
  { href: '/dashboard/projects', label: 'Projects', icon: Briefcase },
  { href: '/dashboard/daily', label: 'Daily', icon: Calendar },
  { href: '/dashboard/knowledge', label: 'Knowledge', icon: BookOpen },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-14 h-[calc(100vh-3.5rem)] w-60 shrink-0 border-r border-[var(--color-border)]/60 bg-[var(--color-surface)]/40 p-4 backdrop-blur-sm">
      <p className="mb-3 px-2 text-[11px] font-semibold uppercase tracking-widest text-[var(--color-muted-foreground)]">
        Dashboard
      </p>
      <nav className="flex flex-col gap-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active =
            href === '/dashboard'
              ? pathname === '/dashboard'
              : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                active
                  ? 'bg-[var(--color-primary-soft)] text-[var(--color-foreground)]'
                  : 'text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]',
              )}
            >
              {active && (
                <span
                  aria-hidden
                  className="absolute inset-y-1 left-0 w-0.5 rounded-full bg-[var(--color-primary)]"
                />
              )}
              <Icon
                size={16}
                className={cn(
                  'transition-colors',
                  active
                    ? 'text-[var(--color-primary)]'
                    : 'text-[var(--color-muted-foreground)] group-hover:text-[var(--color-foreground)]',
                )}
              />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
