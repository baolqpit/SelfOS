import { ProfileForm } from '@/components/modules/profile/profile-form';
import { serverApi } from '@/lib/server-api';
import type { Profile } from '@/types';

export default async function DashboardProfilePage() {
  const api = await serverApi();
  let profile: Profile | null = null;
  try {
    const resp = await api.get('me/profile').json<{ data?: Profile } | Profile | null>();
    profile = ((resp as { data?: Profile })?.data ?? (resp as Profile)) ?? null;
  } catch {
    profile = null;
  }
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Profile</h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Thông tin cá nhân hiển thị trên trang public.
        </p>
      </div>
      <ProfileForm initial={profile} />
    </div>
  );
}
