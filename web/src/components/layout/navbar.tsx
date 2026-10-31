import Link from 'next/link';
import { auth, signOut } from '@/auth';
import { Button } from '@/components/ui/button';

export async function Navbar() {
  const session = await auth();
  return (
    <header className="sticky top-0 z-30 h-14 border-b border-[var(--color-border)]/60 bg-[var(--color-background)]/70 backdrop-blur-xl">
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/icons/penguin-mark.svg"
            alt="selfOS"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="text-base font-bold tracking-tight">
            self<span className="text-gradient">OS</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-3">
          {session?.user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden rounded-md px-3 py-1.5 text-sm font-medium text-[var(--color-muted-foreground)] transition hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)] sm:inline-block"
              >
                Dashboard
              </Link>
              <Link
                href={`/u/${session.user.username}`}
                className="hidden rounded-md px-3 py-1.5 text-sm font-medium text-[var(--color-muted-foreground)] transition hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)] sm:inline-block"
              >
                @{session.user.username}
              </Link>
              <form
                action={async () => {
                  'use server';
                  await signOut({ redirectTo: '/' });
                }}
              >
                <Button variant="outline" size="sm" type="submit">
                  Logout
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-md px-3 py-1.5 text-sm font-medium text-[var(--color-muted-foreground)] transition hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]"
              >
                Login
              </Link>
              <Link href="/register">
                <Button size="sm">Get started</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
