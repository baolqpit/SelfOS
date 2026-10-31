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
    <article className="flex flex-col gap-10">
      <header className="flex flex-col gap-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
          Knowledge
        </p>
        <h1 className="text-4xl font-black leading-tight tracking-tight md:text-5xl">
          {item.title}
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-[var(--color-muted-foreground)]">
          <span>@{username}</span>
          {item.source && <span>· 📚 {item.source}</span>}
          {item.completedAt ? (
            <Badge variant="accent">✓ Hoàn thành</Badge>
          ) : (
            <Badge variant="outline">Đang học</Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {(item.tags ?? []).map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
      </header>

      {(item.method || item.startedAt || item.completedAt) && (
        <dl className="grid gap-x-10 gap-y-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 p-6 text-sm md:grid-cols-3">
          {item.method && (
            <div className="md:col-span-3">
              <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                Phương pháp học
              </dt>
              <dd className="mt-1 text-base">{item.method}</dd>
            </div>
          )}
          {item.startedAt && (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                Bắt đầu
              </dt>
              <dd className="mt-1 text-base font-medium">{formatDate(item.startedAt)}</dd>
            </div>
          )}
          {item.completedAt && (
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                Hoàn thành
              </dt>
              <dd className="mt-1 text-base font-medium">{formatDate(item.completedAt)}</dd>
            </div>
          )}
        </dl>
      )}

      <TiptapRenderer value={item.content as never} html={item.contentHtml} />

      {vis?.showCertificates && item.certificateUrl && (
        <section>
          <h2 className="mb-3 text-xl font-bold tracking-tight">Chứng chỉ</h2>
          <a
            href={item.certificateUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-block overflow-hidden rounded-2xl border border-[var(--color-border)] transition hover:border-[var(--color-primary)]"
          >
            <CloudinaryImage src={item.certificateUrl} alt="certificate" className="max-h-[480px] w-auto" />
          </a>
        </section>
      )}

      {(item.images?.length ?? 0) > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-bold tracking-tight">Ảnh minh hoạ</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {item.images!.map((img, i) => (
              <div key={i} className="relative aspect-square overflow-hidden rounded-xl">
                <CloudinaryImage src={img.url} alt={img.alt ?? ''} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
