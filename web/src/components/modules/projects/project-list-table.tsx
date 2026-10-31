'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Trash2, Pencil } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useAuthedApi } from '@/hooks/use-api';
import { formatDate } from '@/lib/utils';
import type { Project } from '@/types';

export function ProjectListTable({ items }: { items: Project[] }) {
  const api = useAuthedApi();
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const remove = async (id: string) => {
    if (!confirm('Xoá dự án này?')) return;
    try {
      setDeletingId(id);
      await api.delete(`me/projects/${id}`).json();
      router.refresh();
    } finally {
      setDeletingId(null);
    }
  };

  if (items.length === 0) {
    return (
      <p className="text-sm text-[var(--color-muted-foreground)]">
        Chưa có dự án nào. Nhấn <strong>New</strong> để tạo mới.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-[var(--color-border)]">
      <table className="w-full text-sm">
        <thead className="bg-[var(--color-muted)]/60 text-left">
          <tr>
            <th className="p-3">Tên</th>
            <th className="p-3">Trạng thái</th>
            <th className="p-3">Thời gian</th>
            <th className="p-3">Cập nhật</th>
            <th className="p-3 text-right">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id} className="border-t border-[var(--color-border)]">
              <td className="p-3">
                <div className="font-medium">{p.name}</div>
                <div className="text-xs text-[var(--color-muted-foreground)]">/{p.slug}</div>
              </td>
              <td className="p-3">
                {p.isPublished ? <Badge>Published</Badge> : <Badge className="opacity-60">Draft</Badge>}
              </td>
              <td className="p-3 text-xs text-[var(--color-muted-foreground)]">
                {formatDate(p.startDate)} → {formatDate(p.endDate) || 'present'}
              </td>
              <td className="p-3 text-xs">{formatDate(p.updatedAt)}</td>
              <td className="p-3 text-right">
                <div className="inline-flex gap-1">
                  <Link href={`/dashboard/projects/${p.id}/edit`}>
                    <Button size="icon" variant="ghost">
                      <Pencil size={14} />
                    </Button>
                  </Link>
                  <Button
                    size="icon"
                    variant="ghost"
                    loading={deletingId === p.id}
                    onClick={() => remove(p.id)}
                  >
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
