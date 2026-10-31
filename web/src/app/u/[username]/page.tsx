import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { publicApi } from '@/lib/server-api';
import { CloudinaryImage } from '@/components/media/cloudinary-image';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import type { DisplaySettings, Profile } from '@/types';

export const revalidate = 60;

type PublicProfile = Partial<Profile> & { username: string };

async function fetchData(username: string) {
  try {
    const [profileResp, settingsResp] = await Promise.all([
      publicApi.get(`u/${username}/profile`).json<{ data?: PublicProfile } | PublicProfile>(),
      publicApi
        .get(`u/${username}/settings/public`)
        .json<{ data?: DisplaySettings } | DisplaySettings>(),
    ]);
    const profile = (profileResp as { data?: PublicProfile }).data ?? (profileResp as PublicProfile);
    const settings =
      (settingsResp as { data?: DisplaySettings }).data ?? (settingsResp as DisplaySettings);
    return { profile, settings };
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const data = await fetchData(username);
  if (!data) return { title: username };
  const { profile, settings } = data;
  const title = settings.seo?.title ?? `${profile.fullName ?? username}`;
  return {
    title,
    description: settings.seo?.description ?? profile.bio ?? undefined,
    openGraph: {
      title,
      description: settings.seo?.description ?? profile.bio ?? undefined,
      images: settings.seo?.ogImageUrl ?? profile.coverUrl ?? profile.avatarUrl ?? undefined,
    },
  };
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const data = await fetchData(username);
  if (!data) notFound();
  const { profile, settings } = data;
  const mv = settings.modulesVisibility;

  return (
    <div className="flex flex-col gap-6">
      {profile.coverUrl && (
        <div className="relative h-48 w-full overflow-hidden rounded-xl md:h-64">
          <CloudinaryImage src={profile.coverUrl} alt="cover" className="h-full w-full object-cover" />
        </div>
      )}
      <div className="flex items-end gap-4">
        {profile.avatarUrl && (
          <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-[var(--color-background)] md:h-32 md:w-32">
            <CloudinaryImage src={profile.avatarUrl} alt="avatar" width={200} height={200} className="h-full w-full object-cover" />
          </div>
        )}
        <div>
          <h1 className="text-3xl font-bold">{profile.fullName}</h1>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            @{username}
            {profile.occupation && ` · ${profile.occupation}`}
          </p>
        </div>
      </div>
      {profile.bio && <p className="max-w-3xl text-base">{profile.bio}</p>}

      {profile.socialLinks && (
        <div className="flex flex-wrap gap-3 text-sm">
          {Object.entries(profile.socialLinks).map(([k, v]) =>
            v ? (
              <a key={k} href={v} target="_blank" rel="noreferrer" className="underline hover:text-[var(--color-accent)]">
                {k}
              </a>
            ) : null,
          )}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {mv?.projects?.visible !== false && (
          <Link href={`/u/${username}/projects`}>
            <Card className="h-full transition hover:border-[var(--color-primary)]/60">
              <CardTitle>Projects</CardTitle>
              <CardDescription>Dự án đã thực hiện</CardDescription>
            </Card>
          </Link>
        )}
        {mv?.daily?.visible !== false && (
          <Link href={`/u/${username}/daily`}>
            <Card className="h-full transition hover:border-[var(--color-primary)]/60">
              <CardTitle>Daily</CardTitle>
              <CardDescription>Nhật ký / vlog</CardDescription>
            </Card>
          </Link>
        )}
        {mv?.knowledge?.visible !== false && (
          <Link href={`/u/${username}/knowledge`}>
            <Card className="h-full transition hover:border-[var(--color-primary)]/60">
              <CardTitle>Knowledge</CardTitle>
              <CardDescription>Kiến thức & chứng chỉ</CardDescription>
            </Card>
          </Link>
        )}
      </div>
    </div>
  );
}
