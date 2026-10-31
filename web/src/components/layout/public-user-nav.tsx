import Link from 'next/link';
import { CloudinaryImage } from '@/components/media/cloudinary-image';
import type { DisplaySettings } from '@/types';

interface Props {
  username: string;
  fullName: string;
  avatarUrl?: string;
  modulesVisibility: DisplaySettings['modulesVisibility'];
}

export function PublicUserNav({ username, fullName, avatarUrl, modulesVisibility }: Props) {
  const base = `/u/${username}`;
  const tabs: { href: string; label: string }[] = [{ href: base, label: 'Overview' }];
  if (modulesVisibility.projects.visible) tabs.push({ href: `${base}/projects`, label: 'Projects' });
  if (modulesVisibility.daily.visible) tabs.push({ href: `${base}/daily`, label: 'Daily' });
  if (modulesVisibility.knowledge.visible) tabs.push({ href: `${base}/knowledge`, label: 'Knowledge' });

  return (
    <div className="sticky top-14 z-20 border-b border-[var(--color-border)] bg-[var(--color-background)]/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-2.5">
        <Link href={base} className="flex items-center gap-2.5">
          <div className="relative h-8 w-8 overflow-hidden rounded-full border border-[var(--color-border)] bg-[var(--color-muted)]">
            {avatarUrl ? (
              <CloudinaryImage
                src={avatarUrl}
                alt={fullName}
                className="h-full w-full object-cover"
                width={64}
                height={64}
              />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-xs font-semibold">
                {fullName.slice(0, 1).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">{fullName}</span>
            <span className="text-xs text-[var(--color-muted-foreground)]">@{username}</span>
          </div>
        </Link>
        <nav className="flex items-center gap-1 overflow-x-auto">
          {tabs.map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-[var(--color-muted-foreground)] transition hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]"
            >
              {t.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
