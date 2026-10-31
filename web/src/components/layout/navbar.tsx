import Link from 'next/link';
import { auth, signOut } from '@/auth';
import { Button } from '@/components/ui/button';

export async function Navbar() {
  const session = await auth();
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-[var(--color-border)] bg-[var(--color-background)]/80 px-6 backdrop-blur">
      <Link href="/" className="text-lg font-bold tracking-tight">
        self<span className="text-[var(--color-accent)]">OS</span>
      </Link>
      <nav className="flex items-center gap-3">
        {session?.user ? (
          <>
            <Link href="/dashboard" className="text-sm hover:underline">
              Dashboard
            </Link>
            <Link
              href={`/u/${session.user.username}`}
              className="text-sm text-[var(--color-muted-foreground)] hover:underline"
            >
              @{session.user.username}
            </Link>
            <form
              action={async () => {
                'use server';
                await signOut({ redirectTo: '/' });
              }}
            >
              <Button variant="ghost" size="sm" type="submit">
                Logout
              </Button>
            </form>
          </>
        ) : (
          <>
            <Link href="/login" className="text-sm hover:underline">
              Login
            </Link>
            <Link href="/register">
              <Button size="sm">Register</Button>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}
