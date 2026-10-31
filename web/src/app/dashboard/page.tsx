import Link from 'next/link';
import { auth } from '@/auth';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const modules = [
  {
    href: '/dashboard/profile',
    title: 'Profile',
    desc: 'Thông tin cá nhân, avatar, cover, social links.',
    icon: '👤',
    accent: 'from-indigo-500/20 to-indigo-500/5',
  },
  {
    href: '/dashboard/projects',
    title: 'Projects',
    desc: 'Dự án đã làm — tech stack, kết quả, timeline.',
    icon: '🚀',
    accent: 'from-fuchsia-500/20 to-fuchsia-500/5',
  },
  {
    href: '/dashboard/daily',
    title: 'Daily',
    desc: 'Nhật ký / vlog hằng ngày, rich-text + media.',
    icon: '📓',
    accent: 'from-emerald-500/20 to-emerald-500/5',
  },
  {
    href: '/dashboard/knowledge',
    title: 'Knowledge',
    desc: 'Kiến thức đã học, phương pháp, chứng chỉ.',
    icon: '🧠',
    accent: 'from-amber-500/20 to-amber-500/5',
  },
];

export default async function DashboardOverviewPage() {
  const session = await auth();
  const username = session?.user?.username;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      {/* Welcome */}
      <section className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-primary-soft)] via-transparent to-[var(--color-accent-soft)] p-8">
        <Badge variant="accent" className="w-fit">Dashboard</Badge>
        <h1 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">
          Chào, <span className="text-gradient">@{username}</span> 👋
        </h1>
        <p className="mt-2 max-w-2xl text-base text-[var(--color-muted-foreground)]">
          Đây là bảng điều khiển cá nhân của bạn. Hãy chỉnh Profile, thêm Projects, viết Daily
          vlog hoặc ghi lại Knowledge — mọi thứ sẽ xuất hiện trên trang public của bạn.
        </p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Link href={`/u/${username}`}>
            <Button>Mở trang public →</Button>
          </Link>
          <Link href="/dashboard/profile">
            <Button variant="outline">Cập nhật profile</Button>
          </Link>
          <Link href="/dashboard/settings">
            <Button variant="ghost">Settings</Button>
          </Link>
        </div>
      </section>

      {/* Modules */}
      <section>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-[var(--color-muted-foreground)]">
          Modules
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {modules.map((m) => (
            <Link key={m.href} href={m.href} className="group">
              <Card className="relative flex h-full flex-col gap-3 overflow-hidden transition hover:border-[var(--color-primary)]">
                <div
                  aria-hidden
                  className={`pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${m.accent} opacity-80`}
                />
                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-surface)] text-xl shadow-[var(--shadow-sm)]">
                  {m.icon}
                </div>
                <h3 className="relative text-lg font-semibold tracking-tight">{m.title}</h3>
                <p className="relative text-sm text-[var(--color-muted-foreground)]">{m.desc}</p>
                <span className="relative mt-auto pt-3 text-sm font-medium text-[var(--color-accent)] transition group-hover:translate-x-1">
                  Mở →
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Hints */}
      <section className="grid gap-4 md:grid-cols-3">
        <Card className="flex flex-col gap-2">
          <h3 className="text-base font-semibold">🎨 Giao diện</h3>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            Vào <Link href="/dashboard/settings" className="underline">Settings</Link> để đổi theme, màu accent, layout grid/list/magazine.
          </p>
        </Card>
        <Card className="flex flex-col gap-2">
          <h3 className="text-base font-semibold">🔒 Hiển thị public</h3>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            Mỗi field profile và từng module có thể ẩn/hiện tại Settings — mà không mất dữ liệu.
          </p>
        </Card>
        <Card className="flex flex-col gap-2">
          <h3 className="text-base font-semibold">🖼 Rich-text + Cloudinary</h3>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            Dùng toolbar để chèn ảnh/video upload trực tiếp lên Cloudinary ngay trong nội dung.
          </p>
        </Card>
      </section>
    </div>
  );
}
