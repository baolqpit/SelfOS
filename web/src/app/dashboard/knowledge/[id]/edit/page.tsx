import { notFound } from 'next/navigation';
import { serverApi } from '@/lib/server-api';
import { KnowledgeForm } from '@/components/modules/knowledge/knowledge-form';
import type { Knowledge } from '@/types';

export default async function EditKnowledgePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const api = await serverApi();
  let item: Knowledge | null = null;
  try {
    const resp = await api.get(`me/knowledge/${id}`).json<{ data?: Knowledge } | Knowledge>();
    item = (resp as { data?: Knowledge }).data ?? (resp as Knowledge);
  } catch {
    notFound();
  }
  if (!item) notFound();
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-5">
      <h1 className="text-2xl font-semibold">Chỉnh sửa kiến thức</h1>
      <KnowledgeForm initial={item} />
    </div>
  );
}
