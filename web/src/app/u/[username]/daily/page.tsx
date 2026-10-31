import Link from 'next/link';
import { notFound } from 'next/navigation';
import { publicApi } from '@/lib/server-api';
import { Badge } from '@/components/ui/badge';
import { CloudinaryImage } from '@/components/media/cloudinary-image';
import { formatDate } from '@/lib/utils';
import { fetchUserBundle } from '@/lib/user-settings';
import type { DailyVlog, Paginated } from '@/types';

export const revalidate = 60;

export default async function PublicDailyListPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const bundle = await fetchUserBundle(username);
  if (!bundle || !bundle.settings.modulesVisibility.daily.visible) notFound();
  const layout = bundle.settings.layout;

  let items: DailyVlog[] = [];
  try {
    const resp = await publicApi
      .get(`u/${username}/daily`, { searchParams: { pageSize: 50 } })
      .json<{ data?: Paginated<DailyVlog> } | Paginated<DailyVlog>>();
    const data = (resp as { data?: Paginated<DailyVlog> }).data ?? (resp as Paginated<DailyVlog>);
    items = data.items ?? [];
  } catch {
    items = [];
  }

  const grid = layout === 'grid';

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted-foreground)]">
          Daily
        </p>
        <h1 className="text-3xl font-black tracking-tight">
          Nhật ký của <span className="text-gradient">@{username}</span>
        </h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">{items.length} bài viết</p>
      </header>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-border)] p-10 text-center text-sm text-[var(--color-muted-foreground)]">
          Chưa có bài viết public.
        </div>
      ) : (
        <div className={grid ? 'grid gap-4 md:grid-cols-2' : 'flex flex-col gap-4'}>
          {items.map((d) => (
            <Link key={d.id} href={`/u/${username}/daily/${d.slug}`} className="group">
              <article
                className={
                  grid
                    ? 'flex h-full flex-col gap-3 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/70 transition hover:border-[var(--color-primary)]'
                    : 'flex gap-4 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/70 p-4 transition hover:border-[var(--color-primary)] md:items-center'
                }
              >
                {d.coverUrl && (
                  <div
                    className={
                      grid
                        ? 'relative aspect-video overflow-hidden'
                        : 'relative hidden h-24 w-32 flex-shrink-0 overflow-hidden rounded-lg sm:block'
                    }
                  >
                    <CloudinaryImage src={d.coverUrl} alt={d.title} className="h-full w-full object-cover transition group-hover:scale-105" />
                  </div>
                )}
                <div className={grid ? 'flex flex-col gap-2 px-4 pb-4' : 'flex flex-1 flex-col gap-1.5'}>
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    {formatDate(d.publishedAt ?? d.createdAt)}
                  </p>
                  <h3 className="text-base font-semibold tracking-tight group-hover:text-[var(--color-accent)]">
                    {d.title}
                  </h3>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {(d.tags ?? []).map((t) => (
                      <Badge key={t}>{t}</Badge>
                    ))}
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
