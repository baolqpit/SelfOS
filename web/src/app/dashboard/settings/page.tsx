import { serverApi } from '@/lib/server-api';
import { SettingsForm } from '@/components/modules/settings/settings-form';
import type { DisplaySettings } from '@/types';

const DEFAULT: DisplaySettings = {
  theme: 'system',
  layout: 'grid',
  accentColor: '#6366f1',
  modulesVisibility: {
    profile: {
      visible: true,
      fields: {
        fullName: true,
        email: true,
        phone: false,
        address: false,
        dateOfBirth: false,
        occupation: true,
        bio: true,
        avatarUrl: true,
        coverUrl: true,
      },
    },
    projects: { visible: true, showRevenue: false, showClient: true },
    daily: { visible: true },
    knowledge: { visible: true, showCertificates: true },
  },
  seo: null,
};

export default async function DashboardSettingsPage() {
  const api = await serverApi();
  let settings: DisplaySettings = DEFAULT;
  try {
    const resp = await api.get('me/settings').json<{ data?: DisplaySettings } | DisplaySettings>();
    settings = ((resp as { data?: DisplaySettings }).data ?? (resp as DisplaySettings)) ?? DEFAULT;
  } catch {
    settings = DEFAULT;
  }
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-5">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Cấu hình hiển thị trang public của bạn.
        </p>
      </div>
      <SettingsForm initial={settings} />
    </div>
  );
}
