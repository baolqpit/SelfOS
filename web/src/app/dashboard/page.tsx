import Link from 'next/link';
import { auth } from '@/auth';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';

export default async function DashboardOverviewPage() {
  const session = await auth();
  const username = session?.user?.username;
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Chào, @{username}</h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Trang public của bạn:{' '}
          <Link href={`/u/${username}`} className="underline">
            /u/{username}
          </Link>
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { href: '/dashboard/profile', title: 'Profile', desc: 'Thông tin cá nhân, avatar, cover.' },
          { href: '/dashboard/projects', title: 'Projects', desc: 'Danh mục dự án đã làm.' },
          { href: '/dashboard/daily', title: 'Daily', desc: 'Nhật ký / vlog hàng ngày.' },
          { href: '/dashboard/knowledge', title: 'Knowledge', desc: 'Kiến thức, chứng chỉ, phương pháp học.' },
        ].map((item) => (
          <Link key={item.href} href={item.href}>
            <Card className="h-full transition hover:border-[var(--color-primary)]/60">
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.desc}</CardDescription>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
