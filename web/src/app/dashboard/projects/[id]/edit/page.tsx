import { notFound } from 'next/navigation';
import { serverApi } from '@/lib/server-api';
import { ProjectForm } from '@/components/modules/projects/project-form';
import type { Project } from '@/types';

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const api = await serverApi();
  let project: Project | null = null;
  try {
    const resp = await api.get(`me/projects/${id}`).json<{ data?: Project } | Project>();
    project = (resp as { data?: Project }).data ?? (resp as Project);
  } catch {
    notFound();
  }
  if (!project) notFound();
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-5">
      <h1 className="text-2xl font-semibold">Chỉnh sửa dự án</h1>
      <ProjectForm initial={project} />
    </div>
  );
}
