import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { PublicUserNav } from '@/components/layout/public-user-nav';
import { fetchUserBundle, buildThemeStyle, themeAttr } from '@/lib/user-settings';

export const revalidate = 60;

export default async function PublicUserLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const bundle = await fetchUserBundle(username);
  if (!bundle) notFound();
  const { settings, profile } = bundle;
  const style = buildThemeStyle(settings);
  const theme = themeAttr(settings);

  return (
    <div
      className="flex min-h-screen flex-col bg-aurora"
      style={style}
      data-theme={theme}
    >
      <Navbar />
      <PublicUserNav
        username={username}
        fullName={profile?.fullName ?? username}
        avatarUrl={profile?.avatarUrl ?? undefined}
        modulesVisibility={settings.modulesVisibility}
      />
      <main className="mx-auto w-full max-w-5xl px-4 pb-16 pt-6">{children}</main>
    </div>
  );
}
