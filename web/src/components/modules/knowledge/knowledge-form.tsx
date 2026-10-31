'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Field } from '@/components/ui/field';
import { Card, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { CloudinaryUploader } from '@/components/media/cloudinary-uploader';
import { TiptapEditor } from '@/components/editor/tiptap-editor';
import { TagInput } from '@/components/modules/common/tag-input';
import { knowledgeSchema, type KnowledgeInput } from '@/lib/validators/knowledge';
import { useAuthedApi } from '@/hooks/use-api';
import type { Knowledge } from '@/types';

interface Props {
  initial?: Knowledge | null;
}

export function KnowledgeForm({ initial }: Props) {
  const router = useRouter();
  const api = useAuthedApi();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<KnowledgeInput>({
    resolver: zodResolver(knowledgeSchema),
    defaultValues: {
      title: initial?.title ?? '',
      slug: initial?.slug ?? '',
      content: (initial?.content as Record<string, unknown>) ?? { type: 'doc', content: [] },
      contentHtml: initial?.contentHtml ?? '',
      method: initial?.method ?? '',
      source: initial?.source ?? '',
      startedAt: initial?.startedAt ? initial.startedAt.slice(0, 10) : '',
      completedAt: initial?.completedAt ? initial.completedAt.slice(0, 10) : '',
      certificateUrl: initial?.certificateUrl ?? '',
      certificatePublicId: initial?.certificatePublicId ?? '',
      images: initial?.images ?? [],
      tags: initial?.tags ?? [],
      isPublished: initial?.isPublished ?? false,
    },
  });

  const content = watch('content');
  const tags = watch('tags');
  const images = watch('images') ?? [];
  const certificateUrl = watch('certificateUrl');
  const isPublished = watch('isPublished');

  const onSubmit = async (values: KnowledgeInput) => {
    setServerError(null);
    const payload: Record<string, unknown> = { ...values };
    ['slug', 'contentHtml', 'method', 'source', 'startedAt', 'completedAt', 'certificateUrl', 'certificatePublicId'].forEach((k) => {
      if (payload[k] === '') payload[k] = undefined;
    });
    try {
      if (initial?.id) {
        await api.patch(`me/knowledge/${initial.id}`, { json: payload }).json();
      } else {
        await api.post('me/knowledge', { json: payload }).json();
      }
      router.push('/dashboard/knowledge');
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
          <Field label="Tên kiến thức" error={errors.title?.message} className="md:col-span-2">
            <Input {...register('title')} />
          </Field>
          <Field label="Slug (tùy chọn)">
            <Input {...register('slug')} />
          </Field>
          <Field label="Nguồn / khóa học">
            <Input {...register('source')} />
          </Field>
          <Field label="Bắt đầu học">
            <Input type="date" {...register('startedAt')} />
          </Field>
          <Field label="Hoàn thành">
            <Input type="date" {...register('completedAt')} />
          </Field>
          <Field label="Phương pháp học" className="md:col-span-2">
            <Textarea rows={2} {...register('method')} />
          </Field>
        </div>
      </Card>

      <Card className="flex flex-col gap-3">
        <CardTitle>Tags</CardTitle>
        <TagInput value={tags ?? []} onChange={(v) => setValue('tags', v, { shouldDirty: true })} />
      </Card>

      <Card className="flex flex-col gap-3">
        <CardTitle>Chứng chỉ (ảnh/PDF)</CardTitle>
        <CloudinaryUploader
          multiple={false}
          folder="knowledge/certificate"
          resourceType="auto"
          accept="image/*,application/pdf"
          value={certificateUrl ? [{ publicId: watch('certificatePublicId') ?? '', url: certificateUrl, type: 'image' }] : []}
          onChange={(items) => {
            const m = items[0];
            setValue('certificateUrl', m?.url ?? '', { shouldDirty: true });
            setValue('certificatePublicId', m?.publicId ?? '', { shouldDirty: true });
          }}
        />
      </Card>

      <Card className="flex flex-col gap-3">
        <CardTitle>Ảnh minh họa</CardTitle>
        <CloudinaryUploader
          folder="knowledge/images"
          value={images}
          onChange={(v) => setValue('images', v, { shouldDirty: true })}
        />
      </Card>

      <Card className="flex flex-col gap-3">
        <CardTitle>Nội dung</CardTitle>
        <TiptapEditor
          folder="knowledge/content"
          placeholder="Ghi chú kiến thức đã học…"
          value={content as never}
          onChange={(json, html) => {
            setValue('content', json as Record<string, unknown>, { shouldDirty: true });
            setValue('contentHtml', html, { shouldDirty: true });
          }}
        />
      </Card>

      <Card className="flex items-center justify-between">
        <CardTitle>Published</CardTitle>
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
