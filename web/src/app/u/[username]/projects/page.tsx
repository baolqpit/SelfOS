import Link from 'next/link';
import { publicApi } from '@/lib/server-api';
import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { CloudinaryImage } from '@/components/media/cloudinary-image';
import { formatDate } from '@/lib/utils';
import type { Paginated, Project } from '@/types';

export const revalidate = 60;

export default async function PublicProjectsListPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  let items: Project[] = [];
  try {
    const resp = await publicApi
      .get(`u/${username}/projects`, { searchParams: { pageSize: 50 } })
      .json<{ data?: Paginated<Project> } | Paginated<Project>>();
    const data = (resp as { data?: Paginated<Project> }).data ?? (resp as Paginated<Project>);
    items = data.items ?? [];
  } catch {
    items = [];
  }
  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-2xl font-semibold">Projects — @{username}</h1>
      {items.length === 0 ? (
        <p className="text-sm text-[var(--color-muted-foreground)]">Chưa có dự án public.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <Link key={p.id} href={`/u/${username}/projects/${p.slug}`}>
              <Card className="flex h-full flex-col gap-3 transition hover:border-[var(--color-primary)]/60">
                {p.coverUrl && (
                  <div className="aspect-video overflow-hidden rounded-lg">
                    <CloudinaryImage src={p.coverUrl} alt={p.name} className="h-full w-full object-cover" />
                  </div>
                )}
                <CardTitle className="line-clamp-2">{p.name}</CardTitle>
                {p.summary && <CardDescription className="line-clamp-3">{p.summary}</CardDescription>}
                <div className="mt-auto flex flex-wrap gap-1">
                  {(p.technologies ?? []).slice(0, 4).map((t) => (
                    <Badge key={t}>{t}</Badge>
                  ))}
                </div>
                <p className="text-xs text-[var(--color-muted-foreground)]">
                  {formatDate(p.startDate)} → {formatDate(p.endDate) || 'present'}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
