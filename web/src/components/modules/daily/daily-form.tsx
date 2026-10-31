'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Field } from '@/components/ui/field';
import { Card, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { CloudinaryUploader } from '@/components/media/cloudinary-uploader';
import { TiptapEditor } from '@/components/editor/tiptap-editor';
import { TagInput } from '@/components/modules/common/tag-input';
import { dailySchema, type DailyInput } from '@/lib/validators/daily';
import { useAuthedApi } from '@/hooks/use-api';
import type { DailyVlog } from '@/types';

interface Props {
  initial?: DailyVlog | null;
}

export function DailyForm({ initial }: Props) {
  const router = useRouter();
  const api = useAuthedApi();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<DailyInput>({
    resolver: zodResolver(dailySchema),
    defaultValues: {
      title: initial?.title ?? '',
      slug: initial?.slug ?? '',
      content: (initial?.content as Record<string, unknown>) ?? { type: 'doc', content: [] },
      contentHtml: initial?.contentHtml ?? '',
      coverUrl: initial?.coverUrl ?? '',
      videos: initial?.videos ?? [],
      images: initial?.images ?? [],
      tags: initial?.tags ?? [],
      publishedAt: initial?.publishedAt ? initial.publishedAt.slice(0, 10) : '',
      isPublished: initial?.isPublished ?? false,
    },
  });

  const content = watch('content');
  const tags = watch('tags');
  const videos = watch('videos') ?? [];
  const images = watch('images') ?? [];
  const coverUrl = watch('coverUrl');
  const isPublished = watch('isPublished');

  const onSubmit = async (values: DailyInput) => {
    setServerError(null);
    const payload: Record<string, unknown> = { ...values };
    ['slug', 'contentHtml', 'coverUrl', 'publishedAt'].forEach((k) => {
      if (payload[k] === '') payload[k] = undefined;
    });
    try {
      if (initial?.id) {
        await api.patch(`me/daily/${initial.id}`, { json: payload }).json();
      } else {
        await api.post('me/daily', { json: payload }).json();
      }
      router.push('/dashboard/daily');
      router.refresh();
    } catch (e) {
      setServerError(e instanceof Error ? e.message : 'Lưu thất bại');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <Card className="flex flex-col gap-4">
        <CardTitle>Thông tin</CardTitle>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Tiêu đề" error={errors.title?.message} className="md:col-span-2">
            <Input {...register('title')} />
          </Field>
          <Field label="Slug (tùy chọn)" error={errors.slug?.message}>
            <Input {...register('slug')} />
          </Field>
          <Field label="Ngày đăng" error={errors.publishedAt?.message}>
            <Input type="date" {...register('publishedAt')} />
          </Field>
        </div>
      </Card>

      <Card className="flex flex-col gap-3">
        <CardTitle>Tags</CardTitle>
        <TagInput value={tags ?? []} onChange={(v) => setValue('tags', v, { shouldDirty: true })} />
      </Card>

      <Card className="flex flex-col gap-3">
        <CardTitle>Ảnh đại diện</CardTitle>
        <CloudinaryUploader
          multiple={false}
          folder="daily/cover"
          value={coverUrl ? [{ publicId: '', url: coverUrl, type: 'image' }] : []}
          onChange={(items) => setValue('coverUrl', items[0]?.url ?? '', { shouldDirty: true })}
        />
      </Card>

      <Card className="flex flex-col gap-3">
        <CardTitle>Videos</CardTitle>
        <CloudinaryUploader
          folder="daily/videos"
          resourceType="video"
          accept="video/*"
          value={videos}
          onChange={(v) => setValue('videos', v, { shouldDirty: true })}
        />
      </Card>

      <Card className="flex flex-col gap-3">
        <CardTitle>Ảnh phụ</CardTitle>
        <CloudinaryUploader
          folder="daily/images"
          resourceType="image"
          value={images}
          onChange={(v) => setValue('images', v, { shouldDirty: true })}
        />
      </Card>

      <Card className="flex flex-col gap-3">
        <CardTitle>Nội dung</CardTitle>
        <TiptapEditor
          folder="daily/content"
          placeholder="Hôm nay bạn làm gì?"
          value={content as never}
          onChange={(json, html) => {
            setValue('content', json as Record<string, unknown>, { shouldDirty: true });
            setValue('contentHtml', html, { shouldDirty: true });
          }}
        />
      </Card>

      <Card className="flex items-center justify-between">
        <div>
          <CardTitle>Published</CardTitle>
        </div>
        <Switch checked={!!isPublished} onChange={(v) => setValue('isPublished', v, { shouldDirty: true })} />
      </Card>

      {serverError && <p className="text-sm text-[var(--color-destructive)]">{serverError}</p>}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Hủy
        </Button>
        <Button type="submit" loading={isSubmitting}>
          {initial ? 'Lưu thay đổi' : 'Tạo mới'}
        </Button>
      </div>
    </form>
  );
}
