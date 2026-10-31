import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { publicApi } from '@/lib/server-api';
import { Badge } from '@/components/ui/badge';
import { CloudinaryImage } from '@/components/media/cloudinary-image';
import { TiptapRenderer } from '@/components/editor/tiptap-renderer';
import { formatCurrency, formatDate } from '@/lib/utils';
import type { DisplaySettings, Project } from '@/types';

export const revalidate = 60;

async function fetchData(username: string, slug: string) {
  try {
    const [projectResp, settingsResp] = await Promise.all([
      publicApi.get(`u/${username}/projects/${slug}`).json<{ data?: Project } | Project>(),
      publicApi.get(`u/${username}/settings/public`).json<{ data?: DisplaySettings } | DisplaySettings>(),
    ]);
    const project = (projectResp as { data?: Project }).data ?? (projectResp as Project);
    const settings = (settingsResp as { data?: DisplaySettings }).data ?? (settingsResp as DisplaySettings);
    return { project, settings };
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
  const data = await fetchData(username, slug);
  if (!data) return {};
  const { project } = data;
  return {
    title: `${project.name} — @${username}`,
    description: project.summary ?? undefined,
    openGraph: {
      title: project.name,
      description: project.summary ?? undefined,
      images: project.coverUrl ?? undefined,
    },
  };
}

export default async function PublicProjectDetailPage({
  params,
}: {
  params: Promise<{ username: string; slug: string }>;
}) {
  const { username, slug } = await params;
  const data = await fetchData(username, slug);
  if (!data) notFound();
  const { project, settings } = data;
  const vis = settings.modulesVisibility.projects;

  const metaRows: { label: string; value: React.ReactNode }[] = [];
  if (project.startDate) {
    metaRows.push({
      label: 'Thời gian',
      value: `${formatDate(project.startDate)} → ${formatDate(project.endDate) || 'present'}`,
    });
  }
  if (project.teamSize) metaRows.push({ label: 'Team size', value: `${project.teamSize} người` });
  if (project.role) metaRows.push({ label: 'Vai trò', value: project.role });
  if (vis?.showClient && project.client) metaRows.push({ label: 'Khách hàng', value: project.client });
  if (vis?.showRevenue && project.revenueAmount != null) {
    metaRows.push({
      label: 'Doanh thu',
      value: formatCurrency(project.revenueAmount, project.revenueCurrency ?? 'VND'),
    });
  }

  return (
    <article className="flex flex-col gap-10">
      {project.coverUrl && (
        <div className="relative aspect-[21/9] w-full overflow-hidden rounded-3xl border border-[var(--color-border)] shadow-[var(--shadow-lg)]">
          <CloudinaryImage src={project.coverUrl} alt={project.name} priority className="h-full w-full object-cover" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[var(--color-background)]/80 to-transparent" />
        </div>
      )}
      <header className="flex flex-col gap-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-accent)]">
          Project
        </p>
        <h1 className="text-4xl font-black leading-tight tracking-tight md:text-5xl">
          {project.name}
        </h1>
        {project.summary && (
          <p className="max-w-3xl text-lg text-[var(--color-muted-foreground)]">
            {project.summary}
          </p>
        )}
        <div className="flex flex-wrap gap-1.5 pt-2">
          {(project.technologies ?? []).map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
      </header>

      {metaRows.length > 0 && (
        <dl className="grid gap-x-10 gap-y-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/60 p-6 text-sm md:grid-cols-3">
          {metaRows.map((r) => (
            <div key={r.label} className="flex flex-col gap-1">
              <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                {r.label}
              </dt>
              <dd className="text-base font-medium">{r.value}</dd>
            </div>
          ))}
          {project.results && (
            <div className="md:col-span-3">
              <dt className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                Kết quả
              </dt>
              <dd className="mt-1 text-base">{project.results}</dd>
            </div>
          )}
        </dl>
      )}

      <section>
        <TiptapRenderer value={project.content as never} html={project.contentHtml} />
      </section>

      {(project.gallery?.length ?? 0) > 0 && (
        <section>
          <h2 className="mb-3 text-xl font-bold tracking-tight">Thư viện</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {project.gallery!.map((m, i) =>
              m.type === 'video' ? (
                <video key={i} src={m.url} controls className="aspect-video rounded-xl object-cover" />
              ) : (
                <div key={i} className="relative aspect-square overflow-hidden rounded-xl">
                  <CloudinaryImage src={m.url} alt={m.alt ?? ''} className="h-full w-full object-cover" />
                </div>
              ),
            )}
          </div>
        </section>
      )}
    </article>
  );
}
