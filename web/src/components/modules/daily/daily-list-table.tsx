'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Trash2, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuthedApi } from '@/hooks/use-api';
import { formatDate } from '@/lib/utils';
import type { DailyVlog } from '@/types';

export function DailyListTable({ items }: { items: DailyVlog[] }) {
  const api = useAuthedApi();
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const remove = async (id: string) => {
    if (!confirm('Xoá daily này?')) return;
    try {
      setDeletingId(id);
      await api.delete(`me/daily/${id}`).json();
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  };

  if (items.length === 0) {
    return (
      <p className="text-sm text-[var(--color-muted-foreground)]">Chưa có nhật ký nào.</p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--color-border)]">
      <table className="w-full text-sm">
        <thead className="bg-[var(--color-muted)]/60 text-left">
          <tr>
            <th className="p-3">Tiêu đề</th>
            <th className="p-3">Trạng thái</th>
            <th className="p-3">Ngày đăng</th>
            <th className="p-3 text-right">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {items.map((d) => (
            <tr key={d.id} className="border-t border-[var(--color-border)]">
              <td className="p-3">
                <div className="font-medium">{d.title}</div>
                <div className="text-xs text-[var(--color-muted-foreground)]">/{d.slug}</div>
              </td>
              <td className="p-3">
                {d.isPublished ? <Badge>Published</Badge> : <Badge className="opacity-60">Draft</Badge>}
              </td>
              <td className="p-3 text-xs text-[var(--color-muted-foreground)]">{formatDate(d.publishedAt)}</td>
              <td className="p-3 text-right">
                <div className="inline-flex gap-1">
                  <Link href={`/dashboard/daily/${d.id}/edit`}>
                    <Button size="icon" variant="ghost">
                      <Pencil size={14} />
                    </Button>
                  </Link>
                  <Button size="icon" variant="ghost" loading={deletingId === d.id} onClick={() => remove(d.id)}>
                    <Trash2 size={14} />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
