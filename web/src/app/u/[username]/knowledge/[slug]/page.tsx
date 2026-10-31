import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { publicApi } from '@/lib/server-api';
import { Badge } from '@/components/ui/badge';
import { CloudinaryImage } from '@/components/media/cloudinary-image';
import { TiptapRenderer } from '@/components/editor/tiptap-renderer';
import { formatDate } from '@/lib/utils';
import type { DisplaySettings, Knowledge } from '@/types';

export const revalidate = 60;

async function fetchData(username: string, slug: string) {
  try {
    const [kResp, sResp] = await Promise.all([
      publicApi.get(`u/${username}/knowledge/${slug}`).json<{ data?: Knowledge } | Knowledge>(),
      publicApi.get(`u/${username}/settings/public`).json<{ data?: DisplaySettings } | DisplaySettings>(),
    ]);
    return {
      item: (kResp as { data?: Knowledge }).data ?? (kResp as Knowledge),
      settings: (sResp as { data?: DisplaySettings }).data ?? (sResp as DisplaySettings),
    };
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
  const d = await fetchData(username, slug);
  if (!d) return {};
  return { title: `${d.item.title} — @${username}` };
}

export default async function PublicKnowledgeDetailPage({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}) {
  const { username, slug } = await params;
  const data = await fetchData(username, slug);
  if (!data) notFound();
  const { item, settings } = data;
  const vis = settings.modulesVisibility.knowledge;
  return (
    <article className="flex flex-col gap-5">
      <header>
        <h1 className="text-3xl font-bold">{item.title}</h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          @{username}
          {item.source && ` · ${item.source}`}
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {(item.tags ?? []).map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
      </header>

      <dl className="grid gap-x-6 gap-y-2 text-sm md:grid-cols-2">
        {item.method && (
          <div className="md:col-span-2">
            <dt className="text-[var(--color-muted-foreground)]">Phương pháp học</dt>
            <dd>{item.method}</dd>
          </div>
        )}
        {item.startedAt && (
          <div>
            <dt className="text-[var(--color-muted-foreground)]">Bắt đầu</dt>
            <dd>{formatDate(item.startedAt)}</dd>
          </div>
        )}
        {item.completedAt && (
          <div>
            <dt className="text-[var(--color-muted-foreground)]">Hoàn thành</dt>
            <dd>{formatDate(item.completedAt)}</dd>
          </div>
        )}
      </dl>

      <TiptapRenderer value={item.content as never} html={item.contentHtml} />

      {vis?.showCertificates && item.certificateUrl && (
        <section>
          <h2 className="mb-2 text-xl font-semibold">Chứng chỉ</h2>
          <a href={item.certificateUrl} target="_blank" rel="noreferrer">
            <CloudinaryImage src={item.certificateUrl} alt="certificate" className="max-h-[480px] w-auto rounded-lg" />
          </a>
        </section>
      )}

      {(item.images?.length ?? 0) > 0 && (
        <section>
          <h2 className="mb-2 text-xl font-semibold">Ảnh</h2>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
            {item.images!.map((img, i) => (
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
