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

  return (
    <article className="flex flex-col gap-6">
      {project.coverUrl && (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl">
          <CloudinaryImage src={project.coverUrl} alt={project.name} priority className="h-full w-full object-cover" />
        </div>
      )}
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">{project.name}</h1>
        {project.summary && <p className="text-base text-[var(--color-muted-foreground)]">{project.summary}</p>}
        <div className="flex flex-wrap gap-1 pt-2">
          {(project.technologies ?? []).map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>
      </header>

      <dl className="grid gap-x-6 gap-y-2 text-sm md:grid-cols-2">
        {project.startDate && (
          <div>
            <dt className="text-[var(--color-muted-foreground)]">Thời gian</dt>
            <dd>
              {formatDate(project.startDate)} → {formatDate(project.endDate) || 'present'}
            </dd>
          </div>
        )}
        {project.teamSize && (
          <div>
            <dt className="text-[var(--color-muted-foreground)]">Team size</dt>
            <dd>{project.teamSize} người</dd>
          </div>
        )}
        {project.role && (
          <div>
            <dt className="text-[var(--color-muted-foreground)]">Vai trò</dt>
            <dd>{project.role}</dd>
          </div>
        )}
        {vis?.showClient && project.client && (
          <div>
            <dt className="text-[var(--color-muted-foreground)]">Khách hàng</dt>
            <dd>{project.client}</dd>
          </div>
        )}
        {vis?.showRevenue && project.revenueAmount != null && (
          <div>
            <dt className="text-[var(--color-muted-foreground)]">Doanh thu</dt>
            <dd>{formatCurrency(project.revenueAmount, project.revenueCurrency ?? 'VND')}</dd>
          </div>
        )}
        {project.results && (
          <div className="md:col-span-2">
            <dt className="text-[var(--color-muted-foreground)]">Kết quả</dt>
            <dd>{project.results}</dd>
          </div>
        )}
      </dl>

      <section>
        <TiptapRenderer value={project.content as never} html={project.contentHtml} />
      </section>

      {(project.gallery?.length ?? 0) > 0 && (
        <section>
          <h2 className="mb-2 text-xl font-semibold">Thư viện</h2>
          <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-4">
            {project.gallery!.map((m, i) =>
              m.type === 'video' ? (
                <video key={i} src={m.url} controls className="aspect-video rounded-lg object-cover" />
              ) : (
                <div key={i} className="relative aspect-square overflow-hidden rounded-lg">
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
