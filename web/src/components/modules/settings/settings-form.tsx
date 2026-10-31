'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field } from '@/components/ui/field';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useAuthedApi } from '@/hooks/use-api';
import type { DisplaySettings } from '@/types';

interface Props {
  initial: DisplaySettings;
}

export function SettingsForm({ initial }: Props) {
  const router = useRouter();
  const api = useAuthedApi();
  const [state, setState] = useState<DisplaySettings>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      await api
        .put('me/settings', {
          json: {
            theme: state.theme,
            accentColor: state.accentColor ?? undefined,
            layout: state.layout,
            modulesVisibility: state.modulesVisibility,
            seo: state.seo ?? undefined,
            customDomain: state.customDomain ?? undefined,
          },
        })
        .json();
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Lưu thất bại');
    } finally {
      setSaving(false);
    }
  };

  const toggleModule = <K extends keyof DisplaySettings['modulesVisibility']>(
    key: K,
    patch: Partial<DisplaySettings['modulesVisibility'][K]>,
  ) => {
    setState((s) => ({
      ...s,
      modulesVisibility: {
        ...s.modulesVisibility,
        [key]: { ...s.modulesVisibility[key], ...patch },
      },
    }));
  };

  return (
    <div className="flex flex-col gap-5">
      <Card className="flex flex-col gap-3">
        <CardTitle>Giao diện</CardTitle>
        <div className="grid gap-3 md:grid-cols-3">
          <Field label="Theme">
            <select
              className="h-10 rounded-md border border-[var(--color-border)] bg-transparent px-2 text-sm"
              value={state.theme}
              onChange={(e) => setState({ ...state, theme: e.target.value })}
            >
              <option value="system">System</option>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </Field>
          <Field label="Layout">
            <select
              className="h-10 rounded-md border border-[var(--color-border)] bg-transparent px-2 text-sm"
              value={state.layout}
              onChange={(e) =>
                setState({ ...state, layout: e.target.value as DisplaySettings['layout'] })
              }
            >
              <option value="grid">Grid</option>
              <option value="list">List</option>
              <option value="magazine">Magazine</option>
            </select>
          </Field>
          <Field label="Accent color">
            <Input
              type="color"
              value={state.accentColor ?? '#6366f1'}
              onChange={(e) => setState({ ...state, accentColor: e.target.value })}
            />
          </Field>
        </div>
      </Card>

      <Card className="flex flex-col gap-3">
        <CardTitle>Hiển thị modules</CardTitle>
        <CardDescription>Chọn module nào + field nào hiện ra trang public.</CardDescription>

        <div className="flex items-center justify-between py-2">
          <div>
            <p className="font-medium">Profile</p>
            <p className="text-xs text-[var(--color-muted-foreground)]">
              Hiển thị thông tin cá nhân
            </p>
          </div>
          <Switch
            checked={state.modulesVisibility.profile.visible}
            onChange={(v) => toggleModule('profile', { visible: v })}
          />
        </div>
        <div className="grid gap-2 pl-4 md:grid-cols-3">
          {(['email', 'phone', 'address', 'dateOfBirth', 'occupation', 'bio', 'avatarUrl', 'coverUrl', 'socialLinks'] as const).map((k) => (
            <label key={k} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={state.modulesVisibility.profile.fields[k] !== false}
                onChange={(e) =>
                  toggleModule('profile', {
                    fields: { ...state.modulesVisibility.profile.fields, [k]: e.target.checked },
                  })
                }
              />
              {k}
            </label>
          ))}
        </div>

        <div className="my-2 h-px bg-[var(--color-border)]" />
        <div className="flex items-center justify-between">
          <p className="font-medium">Projects</p>
          <Switch
            checked={state.modulesVisibility.projects.visible}
            onChange={(v) => toggleModule('projects', { visible: v })}
          />
        </div>
        <div className="flex gap-4 pl-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={state.modulesVisibility.projects.showRevenue}
              onChange={(e) => toggleModule('projects', { showRevenue: e.target.checked })}
            />
            Hiện doanh thu
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={state.modulesVisibility.projects.showClient}
              onChange={(e) => toggleModule('projects', { showClient: e.target.checked })}
            />
            Hiện khách hàng
          </label>
        </div>

        <div className="my-2 h-px bg-[var(--color-border)]" />
        <div className="flex items-center justify-between">
          <p className="font-medium">Daily</p>
          <Switch
            checked={state.modulesVisibility.daily.visible}
            onChange={(v) => toggleModule('daily', { visible: v })}
          />
        </div>

        <div className="my-2 h-px bg-[var(--color-border)]" />
        <div className="flex items-center justify-between">
          <p className="font-medium">Knowledge</p>
          <Switch
            checked={state.modulesVisibility.knowledge.visible}
            onChange={(v) => toggleModule('knowledge', { visible: v })}
          />
        </div>
        <div className="pl-4 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={state.modulesVisibility.knowledge.showCertificates}
              onChange={(e) =>
                toggleModule('knowledge', { showCertificates: e.target.checked })
              }
            />
            Hiện chứng chỉ
          </label>
        </div>
      </Card>

      <Card className="flex flex-col gap-3">
        <CardTitle>SEO</CardTitle>
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Title">
            <Input
              value={state.seo?.title ?? ''}
              onChange={(e) =>
                setState({ ...state, seo: { ...state.seo, title: e.target.value } })
              }
            />
          </Field>
          <Field label="OG Image URL">
            <Input
              value={state.seo?.ogImageUrl ?? ''}
              onChange={(e) =>
                setState({ ...state, seo: { ...state.seo, ogImageUrl: e.target.value } })
              }
            />
          </Field>
          <Field label="Description" className="md:col-span-2">
            <Input
              value={state.seo?.description ?? ''}
              onChange={(e) =>
                setState({ ...state, seo: { ...state.seo, description: e.target.value } })
              }
            />
          </Field>
        </div>
      </Card>

      {error && <p className="text-sm text-[var(--color-destructive)]">{error}</p>}
      <div className="flex justify-end">
        <Button onClick={save} loading={saving}>Lưu settings</Button>
      </div>
    </div>
  );
}
