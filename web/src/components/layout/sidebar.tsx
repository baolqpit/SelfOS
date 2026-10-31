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
    <aside className="h-full w-56 shrink-0 border-r border-[var(--color-border)] p-3">
      <nav className="flex flex-col gap-1">
        {items.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-2 text-sm transition',
                active
                  ? 'bg-[var(--color-primary)]/15 text-[var(--color-foreground)]'
                  : 'text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]',
              )}
            >
              <Icon size={16} />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
