import Link from 'next/link';
import { CloudinaryImage } from '@/components/media/cloudinary-image';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import type { DisplaySettings, Project } from '@/types';

interface Props {
  username: string;
  project: Project;
  settings: DisplaySettings['modulesVisibility']['projects'];
  variant?: 'grid' | 'list' | 'feature';
}

export function ProjectPublicCard({ username, project, settings, variant = 'grid' }: Props) {
  const href = `/u/${username}/projects/${project.slug}`;
  const techs = (project.technologies ?? []).slice(0, 5);
  const timeRange =
    project.startDate || project.endDate
      ? `${project.startDate ? formatDate(project.startDate) : '…'} — ${
          project.endDate ? formatDate(project.endDate) : 'nay'
        }`
      : null;

  if (variant === 'list') {
    return (
      <Link
        href={href}
        className="group flex gap-4 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/70 p-4 transition hover:border-[var(--color-primary)]"
      >
        {project.coverUrl && (
          <div className="relative hidden h-24 w-32 flex-shrink-0 overflow-hidden rounded-lg sm:block">
            <CloudinaryImage src={project.coverUrl} alt={project.name} className="h-full w-full object-cover" />
          </div>
        )}
        <div className="flex flex-1 flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-base font-semibold tracking-tight group-hover:text-[var(--color-accent)]">
              {project.name}
            </h3>
            {settings.showClient && project.client && (
              <Badge variant="outline">{project.client}</Badge>
            )}
          </div>
          {project.summary && (
            <p className="line-clamp-2 text-sm text-[var(--color-muted-foreground)]">
              {project.summary}
            </p>
          )}
          <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
            {timeRange && <span className="text-[var(--color-muted-foreground)]">{timeRange}</span>}
            {techs.map((t) => (
              <span key={t} className="chip">{t}</span>
            ))}
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'feature') {
    return (
      <Link
        href={href}
        className="group col-span-2 flex flex-col gap-4 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/70 p-5 shadow-[var(--shadow-md)] transition hover:border-[var(--color-primary)] md:flex-row md:items-stretch md:p-0"
      >
        {project.coverUrl && (
          <div className="relative aspect-video w-full overflow-hidden rounded-xl md:aspect-auto md:w-1/2 md:rounded-none">
            <CloudinaryImage src={project.coverUrl} alt={project.name} priority className="h-full w-full object-cover" />
          </div>
        )}
        <div className="flex flex-1 flex-col gap-3 p-0 md:p-6">
          <div className="flex items-center gap-2">
            <Badge variant="accent">Featured</Badge>
            {settings.showClient && project.client && (
              <Badge variant="outline">{project.client}</Badge>
            )}
          </div>
          <h3 className="text-2xl font-bold tracking-tight group-hover:text-[var(--color-accent)]">
            {project.name}
          </h3>
          {project.summary && (
            <p className="text-sm leading-relaxed text-[var(--color-muted-foreground)]">
              {project.summary}
            </p>
          )}
          <div className="flex flex-wrap gap-1.5">
            {techs.map((t) => (
              <span key={t} className="chip">{t}</span>
            ))}
          </div>
          {timeRange && (
            <span className="mt-auto text-xs text-[var(--color-muted-foreground)]">{timeRange}</span>
          )}
        </div>
      </Link>
    );
  }

  // default = grid card
  return (
    <Link
      href={href}
      className="group flex flex-col gap-3 overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)]/70 transition hover:border-[var(--color-primary)] hover:shadow-[var(--shadow-md)]"
    >
      {project.coverUrl ? (
        <div className="relative aspect-video overflow-hidden">
          <CloudinaryImage src={project.coverUrl} alt={project.name} className="h-full w-full object-cover transition group-hover:scale-105" />
        </div>
      ) : (
        <div className="relative aspect-video bg-gradient-to-br from-[var(--color-primary-soft)] to-[var(--color-accent-soft)]" />
      )}
      <div className="flex flex-1 flex-col gap-2 px-4 pb-4">
        {settings.showClient && project.client && (
          <Badge variant="outline" className="w-fit">{project.client}</Badge>
        )}
        <h3 className="text-base font-semibold tracking-tight group-hover:text-[var(--color-accent)]">
          {project.name}
        </h3>
        {project.summary && (
          <p className="line-clamp-2 text-sm text-[var(--color-muted-foreground)]">
            {project.summary}
          </p>
        )}
        <div className="mt-auto flex flex-wrap gap-1 pt-2">
          {techs.map((t) => (
            <span key={t} className="chip">{t}</span>
          ))}
        </div>
      </div>
    </Link>
  );
}
