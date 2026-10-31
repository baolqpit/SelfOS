import Link from 'next/link';
import { publicApi } from '@/lib/server-api';
import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import type { Knowledge, Paginated } from '@/types';

export const revalidate = 60;

export default async function PublicKnowledgeListPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
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
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-semibold">Knowledge — @{username}</h1>
      {items.length === 0 ? (
        <p className="text-sm text-[var(--color-muted-foreground)]">Chưa có mục public.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((k) => (
            <Link key={k.id} href={`/u/${username}/knowledge/${k.slug}`}>
              <Card className="h-full transition hover:border-[var(--color-primary)]/60">
                <CardTitle>{k.title}</CardTitle>
                {k.source && <CardDescription>{k.source}</CardDescription>}
                <div className="mt-2 flex flex-wrap gap-1">
                  {(k.tags ?? []).map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>
                <p className="mt-2 text-xs text-[var(--color-muted-foreground)]">
                  {k.completedAt ? `Hoàn thành ${formatDate(k.completedAt)}` : 'Đang học'}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
