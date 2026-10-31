import Link from 'next/link';
import { auth } from '@/auth';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const features = [
  {
    title: 'Profile portfolio',
    desc: 'Giới thiệu bản thân, ảnh đại diện, social links. Tuỳ chỉnh hiển thị từng field.',
    icon: '👤',
  },
  {
    title: 'Projects',
    desc: 'Lưu dự án đã làm — công nghệ, kết quả, doanh thu, khách hàng, timeline.',
    icon: '🚀',
  },
  {
    title: 'Daily vlog',
    desc: 'Nhật ký hằng ngày với rich-text, ảnh, video — như WordPress nhưng của bạn.',
    icon: '📓',
  },
  {
    title: 'Knowledge',
    desc: 'Ghi lại kiến thức đã học, phương pháp, chứng chỉ. Tra cứu dễ dàng.',
    icon: '🧠',
  },
];

export default async function LandingPage() {
  const session = await auth();
  return (
    <div className="flex min-h-screen flex-col bg-aurora">
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 pt-20 pb-16 text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/penguin-mark.svg"
            alt=""
            width={140}
            height={140}
            className="h-32 w-32 drop-shadow-[0_12px_32px_rgba(99,102,241,0.35)] md:h-36 md:w-36"
          />
          <span className="chip chip-accent">v0.1 · Portfolio-as-a-service</span>
          <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
            Trang cá nhân của bạn,
            <br />
            <span className="text-gradient">được build chỉn chu.</span>
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-[var(--color-muted-foreground)]">
            selfOS giúp bạn tổ chức Profile, Projects, Daily Vlog &amp; Knowledge trong một trang portfolio
            đẹp. Mỗi tài khoản có một URL public dạng{' '}
            <code className="rounded bg-[var(--color-muted)] px-1.5 py-0.5 text-sm">
              /u/username
            </code>
            , dễ chia sẻ.
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            {session?.user ? (
              <>
                <Link href="/dashboard">
                  <Button size="lg">Vào Dashboard →</Button>
                </Link>
                <Link href={`/u/${session.user.username}`}>
                  <Button size="lg" variant="outline">
                    Xem trang public của tôi
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/register">
                  <Button size="lg">Tạo tài khoản miễn phí</Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline">
                    Đăng nhập
                  </Button>
                </Link>
              </>
            )}
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-[var(--color-muted-foreground)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-success)] shadow-[0_0_8px_var(--color-success)]" />
            Server đang chạy · Deploy trên Vercel + Neon
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-5xl px-6 pb-24">
          <div className="grid gap-4 sm:grid-cols-2">
            {features.map((f) => (
              <Card key={f.title} className="group flex flex-col gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-primary-soft)] text-xl">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold tracking-tight">{f.title}</h3>
                <p className="text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                  {f.desc}
                </p>
              </Card>
            ))}
          </div>

          <div className="mt-10 flex flex-col items-start gap-4 rounded-2xl border border-[var(--color-border)] bg-gradient-to-br from-[var(--color-primary-soft)] to-[var(--color-accent-soft)] p-8 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold tracking-tight">Trình soạn thảo như WordPress</h3>
              <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                Rich-text (TipTap): bold, heading, list, link, image, video, YouTube embed, code block.
              </p>
            </div>
            {!session?.user && (
              <Link href="/register">
                <Button size="lg">Bắt đầu</Button>
              </Link>
            )}
          </div>
        </section>
      </main>

      <footer className="border-t border-[var(--color-border)]/60 py-6 text-center text-xs text-[var(--color-muted-foreground)]">
        selfOS · Built with Next.js + NestJS + Cloudinary · {new Date().getFullYear()}
      </footer>
    </div>
  );
}
