import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { publicApi } from '@/lib/server-api';
import { CloudinaryImage } from '@/components/media/cloudinary-image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { fetchUserBundle } from '@/lib/user-settings';
import type { Paginated, Project, DailyVlog, Knowledge } from '@/types';

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const bundle = await fetchUserBundle(username);
  if (!bundle || !bundle.profile) return { title: username };
  const { profile, settings } = bundle;
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

async function fetchCounts(username: string) {
  const empty: Paginated<unknown> = { items: [], page: 1, pageSize: 1, total: 0 };
  const q = { pageSize: 1 };
  try {
    const [p, d, k] = await Promise.all([
      publicApi.get(`u/${username}/projects`, { searchParams: q }).json<{ data?: Paginated<Project> } | Paginated<Project>>().catch(() => empty),
      publicApi.get(`u/${username}/daily`, { searchParams: q }).json<{ data?: Paginated<DailyVlog> } | Paginated<DailyVlog>>().catch(() => empty),
      publicApi.get(`u/${username}/knowledge`, { searchParams: q }).json<{ data?: Paginated<Knowledge> } | Paginated<Knowledge>>().catch(() => empty),
    ]);
    const read = <T,>(v: unknown) => ((v as { data?: Paginated<T> }).data ?? (v as Paginated<T>)).total ?? 0;
    return { projects: read<Project>(p), daily: read<DailyVlog>(d), knowledge: read<Knowledge>(k) };
  } catch {
    return { projects: 0, daily: 0, knowledge: 0 };
  }
}

const SOCIAL_META: Record<string, { label: string; icon: string }> = {
  github: { label: 'GitHub', icon: '🐙' },
  linkedin: { label: 'LinkedIn', icon: '💼' },
  facebook: { label: 'Facebook', icon: '📘' },
  x: { label: 'X', icon: '𝕏' },
  youtube: { label: 'YouTube', icon: '▶️' },
  website: { label: 'Website', icon: '🌐' },
};

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const bundle = await fetchUserBundle(username);
  if (!bundle || !bundle.profile) notFound();
  const { profile, settings } = bundle;
  const mv = settings.modulesVisibility;
  const pf = mv.profile.fields;
  const counts = await fetchCounts(username);

  const showField = (k: keyof typeof pf) => pf[k] !== false;

  return (
    <div className="flex flex-col gap-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)]/70 shadow-[var(--shadow-lg)]">
        {/* Cover */}
        <div className="relative h-48 w-full md:h-64">
          {profile.coverUrl && showField('coverUrl') ? (
            <CloudinaryImage
              src={profile.coverUrl}
              alt=""
              priority
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[var(--color-primary)] via-[var(--color-primary-soft)] to-[var(--color-accent)] opacity-80" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface)] via-transparent to-transparent" />
        </div>

        {/* Avatar + info */}
        <div className="relative -mt-16 flex flex-col gap-5 px-6 pb-7 md:flex-row md:items-end md:gap-7 md:px-10">
          {profile.avatarUrl && showField('avatarUrl') && (
            <div className="h-28 w-28 overflow-hidden rounded-2xl border-4 border-[var(--color-surface)] bg-[var(--color-muted)] shadow-[var(--shadow-md)] md:h-32 md:w-32">
              <CloudinaryImage
                src={profile.avatarUrl}
                alt={profile.fullName ?? username}
                width={256}
                height={256}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-3xl font-black tracking-tight md:text-4xl">
                {profile.fullName}
              </h1>
              <span className="text-sm text-[var(--color-muted-foreground)]">@{username}</span>
            </div>
            {profile.occupation && showField('occupation') && (
              <p className="mt-1 text-base font-medium text-[var(--color-accent)]">
                {profile.occupation}
              </p>
            )}
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--color-muted-foreground)]">
              {profile.address && showField('address') && (
                <span className="chip">📍 {profile.address}</span>
              )}
              {profile.email && showField('email') && (
                <a href={`mailto:${profile.email}`} className="chip hover:border-[var(--color-accent)]">
                  ✉️ {profile.email}
                </a>
              )}
              {profile.phone && showField('phone') && (
                <span className="chip">📞 {profile.phone}</span>
              )}
            </div>
          </div>
        </div>

        {profile.bio && showField('bio') && (
          <p className="mx-6 mb-7 max-w-3xl text-base leading-relaxed text-[var(--color-muted-foreground)] md:mx-10">
            {profile.bio}
          </p>
        )}

        {profile.socialLinks && showField('socialLinks') && (
          <div className="mx-6 mb-7 flex flex-wrap gap-2 md:mx-10">
            {Object.entries(profile.socialLinks).map(([k, v]) => {
              if (!v) return null;
              const meta = SOCIAL_META[k] ?? { label: k, icon: '🔗' };
              return (
                <a
                  key={k}
                  href={v}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-1.5 rounded-lg border border-[var(--color-border)] bg-[var(--color-muted)]/60 px-3 py-1.5 text-sm transition hover:border-[var(--color-accent)] hover:bg-[var(--color-accent-soft)]"
                >
                  <span>{meta.icon}</span>
                  <span className="font-medium">{meta.label}</span>
                </a>
              );
            })}
          </div>
        )}
      </section>

      {/* Modules */}
      <section className="grid gap-4 md:grid-cols-3">
        {mv.projects.visible && (
          <Link href={`/u/${username}/projects`} className="group">
            <Card className="relative flex h-full flex-col gap-2 overflow-hidden transition hover:border-[var(--color-primary)]">
              <div className="absolute right-5 top-5 text-3xl opacity-70">🚀</div>
              <Badge variant="accent" className="w-fit">{counts.projects} items</Badge>
              <h3 className="text-xl font-bold tracking-tight">Projects</h3>
              <p className="text-sm text-[var(--color-muted-foreground)]">
                Dự án đã thực hiện — công nghệ, kết quả, timeline.
              </p>
              <span className="mt-auto pt-3 text-sm font-medium text-[var(--color-accent)] transition group-hover:translate-x-1">
                Xem tất cả →
              </span>
            </Card>
          </Link>
        )}
        {mv.daily.visible && (
          <Link href={`/u/${username}/daily`} className="group">
            <Card className="relative flex h-full flex-col gap-2 overflow-hidden transition hover:border-[var(--color-primary)]">
              <div className="absolute right-5 top-5 text-3xl opacity-70">📓</div>
              <Badge variant="accent" className="w-fit">{counts.daily} entries</Badge>
              <h3 className="text-xl font-bold tracking-tight">Daily</h3>
              <p className="text-sm text-[var(--color-muted-foreground)]">
                Nhật ký, vlog, suy nghĩ hằng ngày.
              </p>
              <span className="mt-auto pt-3 text-sm font-medium text-[var(--color-accent)] transition group-hover:translate-x-1">
                Xem tất cả →
              </span>
            </Card>
          </Link>
        )}
        {mv.knowledge.visible && (
          <Link href={`/u/${username}/knowledge`} className="group">
            <Card className="relative flex h-full flex-col gap-2 overflow-hidden transition hover:border-[var(--color-primary)]">
              <div className="absolute right-5 top-5 text-3xl opacity-70">🧠</div>
              <Badge variant="accent" className="w-fit">{counts.knowledge} items</Badge>
              <h3 className="text-xl font-bold tracking-tight">Knowledge</h3>
              <p className="text-sm text-[var(--color-muted-foreground)]">
                Kiến thức, chứng chỉ, phương pháp học.
              </p>
              <span className="mt-auto pt-3 text-sm font-medium text-[var(--color-accent)] transition group-hover:translate-x-1">
                Xem tất cả →
              </span>
            </Card>
          </Link>
        )}
      </section>
    </div>
  );
}
