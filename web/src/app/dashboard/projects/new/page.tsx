import { ProjectForm } from '@/components/modules/projects/project-form';

export default function NewProjectPage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-5">
      <h1 className="text-2xl font-semibold">Dự án mới</h1>
      <ProjectForm />
    </div>
  );
}
