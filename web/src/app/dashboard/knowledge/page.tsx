import Link from 'next/link';
import { serverApi } from '@/lib/server-api';
import { Button } from '@/components/ui/button';
import { KnowledgeListTable } from '@/components/modules/knowledge/knowledge-list-table';
import type { Knowledge, Paginated } from '@/types';

export default async function DashboardKnowledgePage() {
  const api = await serverApi();
  let items: Knowledge[] = [];
  try {
    const resp = await api
      .get('me/knowledge', { searchParams: { pageSize: 50 } })
      .json<{ data?: Paginated<Knowledge> } | Paginated<Knowledge>>();
    const data = (resp as { data?: Paginated<Knowledge> }).data ?? (resp as Paginated<Knowledge>);
    items = data.items ?? [];
  } catch {
    items = [];
  }
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Knowledge</h1>
          <p className="text-sm text-[var(--color-muted-foreground)]">Kiến thức đã học, chứng chỉ.</p>
        </div>
        <Link href="/dashboard/knowledge/new">
          <Button>+ New</Button>
        </Link>
      </div>
      <KnowledgeListTable items={items} />
    </div>
  );
}
