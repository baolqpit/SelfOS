import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-semibold">404 — Không tìm thấy</h1>
      <Link href="/">
        <Button variant="outline">Về trang chủ</Button>
      </Link>
    </div>
  );
}
