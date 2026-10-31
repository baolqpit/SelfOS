import Link from 'next/link';
import { notFound } from 'next/navigation';
import { publicApi } from '@/lib/server-api';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { fetchUserBundle } from '@/lib/user-settings';
import type { Knowledge, Paginated } from '@/types';

export const revalidate = 60;

export default async function PublicKnowledgeListPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const bundle = await fetchUserBundle(username);
  if (!bundle || !bundle.settings.modulesVisibility.knowledge.visible) notFound();
  const layout = bundle.settings.layout;

  let items: Knowledge[] = [];
  try {
    const resp = await publicApi
      .get(`u/${username}/knowledge`, { searchParams: { pageSize: 50 } })
      .json<{ data?: Paginated<Knowledge> } | Paginated<Knowledge>>();
    const data = (resp as { data?: Paginated<Knowledge> }).data ?? (resp as Paginated<Knowledge>);
    items = data.items ?? [];
  } catch {
    items = [];
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted-foreground)]">
          Knowledge
        </p>
        <h1 className="text-3xl font-black tracking-tight">
          Kiến thức của <span className="text-gradient">@{username}</span>
        </h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">{items.length} mục</p>
      </header>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-border)] p-10 text-center text-sm text-[var(--color-muted-foreground)]">
          Chưa có mục public.
        </div>
      ) : (
        <div
          className={
            layout === 'list'
              ? 'flex flex-col gap-3'
              : 'grid gap-4 md:grid-cols-2 lg:grid-cols-3'
          }
        >
          {items.map((k) => (
            <Link key={k.id} href={`/u/${username}/knowledge/${k.slug}`} className="group">
              <article className="flex h-full flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/70 p-5 transition hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-md)]">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold tracking-tight group-hover:text-[var(--color-accent)]">
                    {k.title}
                  </h3>
                  {k.completedAt ? (
                    <Badge variant="accent">✓ Hoàn thành</Badge>
                  ) : (
                    <Badge variant="outline">Đang học</Badge>
                  )}
                </div>
                {k.source && (
                  <p className="line-clamp-1 text-xs text-[var(--color-muted-foreground)]">
                    📚 {k.source}
                  </p>
                )}
                <div className="flex flex-wrap gap-1">
                  {(k.tags ?? []).map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>
                <p className="mt-auto text-xs text-[var(--color-muted-foreground)]">
                  {k.completedAt
                    ? `Hoàn thành ${formatDate(k.completedAt)}`
                    : k.startedAt
                    ? `Bắt đầu ${formatDate(k.startedAt)}`
                    : null}
                </p>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
