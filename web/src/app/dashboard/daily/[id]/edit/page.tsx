import { notFound } from 'next/navigation';
import { serverApi } from '@/lib/server-api';
import { DailyForm } from '@/components/modules/daily/daily-form';
import type { DailyVlog } from '@/types';

export default async function EditDailyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const api = await serverApi();
  let item: DailyVlog | null = null;
  try {
    const resp = await api.get(`me/daily/${id}`).json<{ data?: DailyVlog } | DailyVlog>();
    item = (resp as { data?: DailyVlog }).data ?? (resp as DailyVlog);
  } catch {
    notFound();
  }
  if (!item) notFound();
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-5">
      <h1 className="text-2xl font-semibold">Chỉnh sửa nhật ký</h1>
      <DailyForm initial={item} />
    </div>
  );
}
