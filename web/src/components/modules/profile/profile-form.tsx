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
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Đây là thông tin hiển thị trên trang public <code>/u/username</code>.
          Có thể bật/tắt từng mục ở trang <strong>Settings</strong>.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Họ và tên"
            hint="Hiển thị dưới dạng tiêu đề lớn ở trang profile."
            error={errors.fullName?.message}
          >
            <Input placeholder="VD: Nguyễn Văn A" {...register('fullName')} />
          </Field>
          <Field
            label="Email hiển thị"
            hint="Email public cho khách truy cập liên hệ — có thể khác email đăng nhập."
            error={errors.email?.message}
          >
            <Input type="email" placeholder="you@example.com" {...register('email')} />
          </Field>
          <Field
            label="Ngày sinh"
            hint="Mặc định ẩn khỏi public, chỉ hiện khi bạn bật ở Settings."
            error={errors.dateOfBirth?.message}
          >
            <Input type="date" {...register('dateOfBirth')} />
          </Field>
          <Field
            label="Số điện thoại"
            hint="Để trống nếu không muốn public. Có thể kèm mã vùng."
            error={errors.phone?.message}
          >
            <Input placeholder="+84 912 345 678" {...register('phone')} />
          </Field>
          <Field
            label="Địa chỉ"
            hint="Thành phố/quốc gia là đủ — không cần địa chỉ chi tiết."
            error={errors.address?.message}
            className="md:col-span-2"
          >
            <Input placeholder="TP. Hồ Chí Minh, Việt Nam" {...register('address')} />
          </Field>
          <Field
            label="Nghề nghiệp"
            hint="Chức danh/vai trò chính — hiện ngay dưới tên."
            error={errors.occupation?.message}
            className="md:col-span-2"
          >
            <Input placeholder="VD: Senior Full-stack Engineer @ Startup XYZ" {...register('occupation')} />
          </Field>
          <Field
            label="Bio ngắn"
            hint="1–3 câu giới thiệu bản thân (tối đa 500 ký tự)."
            error={errors.bio?.message}
            className="md:col-span-2"
          >
            <Textarea
              rows={3}
              placeholder="VD: Yêu TypeScript, cà phê đen, và những buổi code đêm. Hiện đang làm việc tại..."
              {...register('bio')}
            />
          </Field>
        </div>
      </Card>

      <Card className="flex flex-col gap-4">
        <CardTitle>Avatar & Cover</CardTitle>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Hỗ trợ JPG/PNG/WebP. Khuyến nghị: avatar vuông 400×400, cover 1600×500. File &gt;5MB sẽ được Cloudinary tự tối ưu.
        </p>
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
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Dán URL đầy đủ (bắt đầu bằng <code>https://</code>). Để trống nếu không muốn hiển thị.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {(
            [
              { key: 'github', placeholder: 'https://github.com/username' },
              { key: 'linkedin', placeholder: 'https://linkedin.com/in/username' },
              { key: 'facebook', placeholder: 'https://facebook.com/username' },
              { key: 'x', placeholder: 'https://x.com/username' },
              { key: 'youtube', placeholder: 'https://youtube.com/@channel' },
              { key: 'website', placeholder: 'https://your-site.com' },
            ] as const
          ).map(({ key, placeholder }) => (
            <Field key={key} label={key[0].toUpperCase() + key.slice(1)}>
              <Input
                defaultValue={(socialLinks as Record<string, string>)[key] ?? ''}
                onChange={(e) => setSocial(key, e.target.value)}
                placeholder={placeholder}
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
