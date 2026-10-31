'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Field } from '@/components/ui/field';
import { Card, CardTitle } from '@/components/ui/card';
import { CloudinaryUploader } from '@/components/media/cloudinary-uploader';
import { profileSchema, type ProfileInput } from '@/lib/validators/profile';
import { useAuthedApi } from '@/hooks/use-api';
import type { Profile } from '@/types';

interface Props {
  initial?: Profile | null;
}

export function ProfileForm({ initial }: Props) {
  const router = useRouter();
  const api = useAuthedApi();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProfileInput>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: initial?.fullName ?? '',
      email: initial?.email ?? '',
      dateOfBirth: initial?.dateOfBirth ? initial.dateOfBirth.slice(0, 10) : '',
      address: initial?.address ?? '',
      phone: initial?.phone ?? '',
      occupation: initial?.occupation ?? '',
      bio: initial?.bio ?? '',
      avatarUrl: initial?.avatarUrl ?? '',
      avatarPublicId: initial?.avatarPublicId ?? '',
      coverUrl: initial?.coverUrl ?? '',
      coverPublicId: initial?.coverPublicId ?? '',
      socialLinks: (initial?.socialLinks ?? {}) as Record<string, string>,
    },
  });

  const avatarUrl = watch('avatarUrl');
  const coverUrl = watch('coverUrl');
  const socialLinks = watch('socialLinks') ?? {};

  const onSubmit = async (values: ProfileInput) => {
    setServerError(null);
    try {
      const payload: Record<string, unknown> = { ...values };
      // Clean empty strings → undefined for optional fields
      ['dateOfBirth', 'address', 'phone', 'occupation', 'bio', 'avatarUrl', 'avatarPublicId', 'coverUrl', 'coverPublicId'].forEach((k) => {
        if (payload[k] === '') payload[k] = undefined;
      });
      await api.put('me/profile', { json: payload }).json();
      router.refresh();
    } catch (e) {
      setServerError(e instanceof Error ? e.message : 'Lưu thất bại');
    }
  };

  const setSocial = (key: string, value: string) => {
    setValue('socialLinks', { ...(socialLinks as Record<string, string>), [key]: value }, { shouldDirty: true });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <Card className="flex flex-col gap-4">
        <CardTitle>Thông tin cá nhân</CardTitle>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Họ và tên" error={errors.fullName?.message}>
            <Input {...register('fullName')} />
          </Field>
          <Field label="Email hiển thị" error={errors.email?.message}>
            <Input type="email" {...register('email')} />
          </Field>
          <Field label="Ngày sinh" error={errors.dateOfBirth?.message}>
            <Input type="date" {...register('dateOfBirth')} />
          </Field>
          <Field label="Số điện thoại" error={errors.phone?.message}>
            <Input {...register('phone')} />
          </Field>
          <Field label="Địa chỉ" error={errors.address?.message} className="md:col-span-2">
            <Input {...register('address')} />
          </Field>
          <Field label="Nghề nghiệp" error={errors.occupation?.message} className="md:col-span-2">
            <Input {...register('occupation')} />
          </Field>
          <Field label="Bio ngắn" error={errors.bio?.message} className="md:col-span-2">
            <Textarea rows={3} {...register('bio')} />
          </Field>
        </div>
      </Card>

      <Card className="flex flex-col gap-4">
        <CardTitle>Avatar & Cover</CardTitle>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="mb-2 text-sm font-medium">Avatar</p>
            <CloudinaryUploader
              multiple={false}
              folder="profile/avatar"
              value={avatarUrl ? [{ publicId: watch('avatarPublicId') ?? 'avatar', url: avatarUrl, type: 'image' }] : []}
              onChange={(items) => {
                const m = items[0];
                setValue('avatarUrl', m?.url ?? '', { shouldDirty: true });
                setValue('avatarPublicId', m?.publicId ?? '', { shouldDirty: true });
              }}
              label="Chọn avatar"
            />
          </div>
          <div>
            <p className="mb-2 text-sm font-medium">Cover</p>
            <CloudinaryUploader
              multiple={false}
              folder="profile/cover"
              value={coverUrl ? [{ publicId: watch('coverPublicId') ?? 'cover', url: coverUrl, type: 'image' }] : []}
              onChange={(items) => {
                const m = items[0];
                setValue('coverUrl', m?.url ?? '', { shouldDirty: true });
                setValue('coverPublicId', m?.publicId ?? '', { shouldDirty: true });
              }}
              label="Chọn cover"
            />
          </div>
        </div>
      </Card>

      <Card className="flex flex-col gap-4">
        <CardTitle>Social links</CardTitle>
        <div className="grid gap-3 md:grid-cols-2">
          {['github', 'linkedin', 'facebook', 'x', 'youtube', 'website'].map((key) => (
            <Field key={key} label={key}>
              <Input
                defaultValue={(socialLinks as Record<string, string>)[key] ?? ''}
                onChange={(e) => setSocial(key, e.target.value)}
                placeholder={`https://${key}.com/username`}
              />
            </Field>
          ))}
        </div>
      </Card>

      {serverError && <p className="text-sm text-[var(--color-destructive)]">{serverError}</p>}

      <div className="flex justify-end">
        <Button type="submit" loading={isSubmitting}>
          Lưu profile
        </Button>
      </div>
    </form>
  );
}
