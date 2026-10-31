import { notFound } from 'next/navigation';
import { publicApi } from '@/lib/server-api';
import { ProjectPublicCard } from '@/components/modules/projects/project-public-card';
import { fetchUserBundle } from '@/lib/user-settings';
import type { Paginated, Project } from '@/types';

export const revalidate = 60;

export default async function PublicProjectsListPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const bundle = await fetchUserBundle(username);
  if (!bundle || !bundle.settings.modulesVisibility.projects.visible) notFound();
  const { settings } = bundle;
  const layout = settings.layout;
  const projSettings = settings.modulesVisibility.projects;

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
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-2">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted-foreground)]">
          Projects
        </p>
        <h1 className="text-3xl font-black tracking-tight">
          Dự án của <span className="text-gradient">@{username}</span>
        </h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          {items.length} dự án · hiển thị theo layout <strong>{layout}</strong>
        </p>
      </header>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[var(--color-border)] p-10 text-center text-sm text-[var(--color-muted-foreground)]">
          Chưa có dự án public.
        </div>
      ) : layout === 'list' ? (
        <div className="flex flex-col gap-3">
          {items.map((p) => (
            <ProjectPublicCard
              key={p.id}
              username={username}
              project={p}
              settings={projSettings}
              variant="list"
            />
          ))}
        </div>
      ) : layout === 'magazine' ? (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((p, i) => (
            <ProjectPublicCard
              key={p.id}
              username={username}
              project={p}
              settings={projSettings}
              variant={i === 0 ? 'feature' : 'grid'}
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {items.map((p) => (
            <ProjectPublicCard
              key={p.id}
              username={username}
              project={p}
              settings={projSettings}
              variant="grid"
            />
          ))}
        </div>
      )}
    </div>
  );
}
