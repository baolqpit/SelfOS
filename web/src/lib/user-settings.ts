import { publicApi } from '@/lib/server-api';
import type { DisplaySettings, Profile } from '@/types';

export type UserBundle = {
  profile: (Partial<Profile> & { username: string }) | null;
  settings: DisplaySettings;
};

/** Default settings used when BE returns 404 (user hidden) or network fails. */
const DEFAULT_SETTINGS: DisplaySettings = {
  theme: 'system',
  accentColor: undefined,
  layout: 'grid',
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
        socialLinks: true,
      },
    },
    projects: { visible: true, showRevenue: false, showClient: true },
    daily: { visible: true },
    knowledge: { visible: true, showCertificates: true },
  },
  seo: undefined,
};

export async function fetchUserBundle(username: string): Promise<UserBundle | null> {
  try {
    const [profileResp, settingsResp] = await Promise.all([
      publicApi
        .get(`u/${username}/profile`)
        .json<{ data?: Partial<Profile> } | Partial<Profile>>(),
      publicApi
        .get(`u/${username}/settings/public`)
        .json<{ data?: Partial<DisplaySettings> } | Partial<DisplaySettings>>(),
    ]);
    const profile = (profileResp as { data?: Partial<Profile> }).data ?? (profileResp as Partial<Profile>);
    const settingsRaw =
      (settingsResp as { data?: Partial<DisplaySettings> }).data ?? (settingsResp as Partial<DisplaySettings>);

    const settings: DisplaySettings = {
      ...DEFAULT_SETTINGS,
      ...settingsRaw,
      modulesVisibility: {
        ...DEFAULT_SETTINGS.modulesVisibility,
        ...(settingsRaw?.modulesVisibility ?? {}),
      },
    };

    return {
      profile: profile ? { ...profile, username } : null,
      settings,
    };
  } catch {
    return null;
  }
}

/**
 * Build a style string (`style="..."`) for the public user section.
 * Overrides the accent color and forces theme by setting data-theme-aware CSS vars.
 */
export function buildThemeStyle(settings: DisplaySettings): React.CSSProperties {
  const vars: Record<string, string> = {};
  if (settings.accentColor) {
    vars['--color-accent'] = settings.accentColor;
    vars['--color-primary'] = settings.accentColor;
  }
  return vars as React.CSSProperties;
}

export function themeAttr(settings: DisplaySettings): 'light' | 'dark' | undefined {
  if (settings.theme === 'light' || settings.theme === 'dark') return settings.theme;
  return undefined; // "system" → follow <html> default (dark)
}
