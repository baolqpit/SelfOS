import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { publicApi } from '@/lib/server-api';
import { Badge } from '@/components/ui/badge';
import { CloudinaryImage } from '@/components/media/cloudinary-image';
import { TiptapRenderer } from '@/components/editor/tiptap-renderer';
import { formatDate } from '@/lib/utils';
import type { DailyVlog } from '@/types';

export const revalidate = 60;

async function fetchDaily(username: string, slug: string): Promise<DailyVlog | null> {
  try {
    const resp = await publicApi.get(`u/${username}/daily/${slug}`).json<{ data?: DailyVlog } | DailyVlog>();
    return (resp as { data?: DailyVlog }).data ?? (resp as DailyVlog);
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}): Promise<Metadata> {
  const { username, slug } = await params;
  const d = await fetchDaily(username, slug);
  if (!d) return {};
  return {
    title: `${d.title} — @${username}`,
    openGraph: { title: d.title, images: d.coverUrl ?? undefined },
  };
}

export default async function PublicDailyDetailPage({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}) {
  const { username, slug } = await params;
  const d = await fetchDaily(username, slug);
  if (!d) notFound();
  return (
    <article className="flex flex-col gap-5">
      {d.coverUrl && (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl">
          <CloudinaryImage src={d.coverUrl} alt={d.title} priority className="h-full w-full object-cover" />
        </div>
      )}
      <header>
        <h1 className="text-3xl font-bold">{d.title}</h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          @{username} · {formatDate(d.publishedAt ?? d.createdAt)}
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {(d.tags ?? []).map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
      </header>
      <TiptapRenderer value={d.content as never} html={d.contentHtml} />
      {(d.videos?.length ?? 0) > 0 && (
        <section>
          <h2 className="mb-2 text-xl font-semibold">Videos</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {d.videos!.map((v, i) => (
              <video key={i} src={v.url} controls className="w-full rounded-lg" />
            ))}
          </div>
        </section>
      )}
      {(d.images?.length ?? 0) > 0 && (
        <section>
          <h2 className="mb-2 text-xl font-semibold">Ảnh</h2>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {d.images!.map((img, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-lg">
                <CloudinaryImage src={img.url} alt={img.alt ?? ''} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
