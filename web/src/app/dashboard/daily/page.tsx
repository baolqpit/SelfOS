import Link from 'next/link';
import { serverApi } from '@/lib/server-api';
import { Button } from '@/components/ui/button';
import { DailyListTable } from '@/components/modules/daily/daily-list-table';
import type { DailyVlog, Paginated } from '@/types';

export default async function DashboardDailyPage() {
  const api = await serverApi();
  let items: DailyVlog[] = [];
  try {
    const resp = await api
      .get('me/daily', { searchParams: { pageSize: 50 } })
      .json<{ data?: Paginated<DailyVlog> } | Paginated<DailyVlog>>();
    const data = (resp as { data?: Paginated<DailyVlog> }).data ?? (resp as Paginated<DailyVlog>);
    items = data.items ?? [];
  } catch {
    items = [];
  }
  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Daily</h1>
          <p className="text-sm text-[var(--color-muted-foreground)]">Nhật ký / vlog hàng ngày.</p>
        </div>
        <Link href="/dashboard/daily/new">
          <Button>+ New</Button>
        </Link>
      </div>
      <DailyListTable items={items} />
    </div>
  );
}
