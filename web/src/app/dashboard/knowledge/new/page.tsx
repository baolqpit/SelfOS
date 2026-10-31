import { KnowledgeForm } from '@/components/modules/knowledge/knowledge-form';

export default function NewKnowledgePage() {
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-5">
      <h1 className="text-2xl font-semibold">Kiến thức mới</h1>
      <KnowledgeForm />
    </div>
  );
}
