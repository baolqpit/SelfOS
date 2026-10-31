import Link from 'next/link';
import { serverApi } from '@/lib/server-api';
import { Button } from '@/components/ui/button';
import { ProjectListTable } from '@/components/modules/projects/project-list-table';
import type { Paginated, Project } from '@/types';

export default async function DashboardProjectsPage() {
  const api = await serverApi();
  let items: Project[] = [];
  try {
    const resp = await api
      .get('me/projects', { searchParams: { pageSize: 50 } })
      .json<{ data?: Paginated<Project> } | Paginated<Project>>();
    const data = (resp as { data?: Paginated<Project> }).data ?? (resp as Paginated<Project>);
    items = data.items ?? [];
  } catch {
    items = [];
  }
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Projects</h1>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            Quản lý danh sách dự án.
          </p>
        </div>
        <Link href="/dashboard/projects/new">
          <Button>+ New</Button>
        </Link>
      </div>
      <ProjectListTable items={items} />
    </div>
  );
}
