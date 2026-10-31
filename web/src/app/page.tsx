import Link from 'next/link';
import { auth } from '@/auth';
import { Navbar } from '@/components/layout/navbar';
import { Button } from '@/components/ui/button';

export default async function LandingPage() {
  const session = await auth();
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center gap-6 px-6 py-20 text-center">
        <h1 className="text-5xl font-bold tracking-tight">
          self<span className="text-[var(--color-accent)]">OS</span>
        </h1>
        <p className="max-w-xl text-lg text-[var(--color-muted-foreground)]">
          Trang portfolio cá nhân đa người dùng. Quản lý Profile, Projects, Daily Vlog, Knowledge —
          mỗi user có một URL public <code>/u/username</code>.
        </p>
        <div className="flex gap-3">
          {session?.user ? (
            <>
              <Link href="/dashboard">
                <Button>Vào Dashboard</Button>
              </Link>
              <Link href={`/u/${session.user.username}`}>
                <Button variant="outline">Xem trang public của tôi</Button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/register">
                <Button>Bắt đầu</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline">Đăng nhập</Button>
              </Link>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
