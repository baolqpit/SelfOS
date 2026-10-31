import Link from 'next/link';
import { publicApi } from '@/lib/server-api';
import { Badge } from '@/components/ui/badge';
import { Card, CardTitle } from '@/components/ui/card';
import { CloudinaryImage } from '@/components/media/cloudinary-image';
import { formatDate } from '@/lib/utils';
import type { DailyVlog, Paginated } from '@/types';

export const revalidate = 60;

export default async function PublicDailyListPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
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
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-semibold">Daily — @{username}</h1>
      {items.length === 0 ? (
        <p className="text-sm text-[var(--color-muted-foreground)]">Chưa có bài viết public.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {items.map((d) => (
            <Link key={d.id} href={`/u/${username}/daily/${d.slug}`}>
              <Card className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                {d.coverUrl && (
                  <div className="aspect-video w-full overflow-hidden rounded-lg md:w-48">
                    <CloudinaryImage src={d.coverUrl} alt={d.title} className="h-full w-full object-cover" />
                  </div>
                )}
                <div className="flex-1">
                  <CardTitle>{d.title}</CardTitle>
                  <p className="text-xs text-[var(--color-muted-foreground)]">
                    {formatDate(d.publishedAt ?? d.createdAt)}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {(d.tags ?? []).map((t) => (
                      <Badge key={t}>{t}</Badge>
                    ))}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
