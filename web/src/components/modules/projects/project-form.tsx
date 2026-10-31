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
import { projectSchema, type ProjectInput } from '@/lib/validators/project';
import { useAuthedApi } from '@/hooks/use-api';
import type { Project } from '@/types';

interface Props {
  initial?: Project | null;
}

export function ProjectForm({ initial }: Props) {
  const router = useRouter();
  const api = useAuthedApi();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: initial?.name ?? '',
      slug: initial?.slug ?? '',
      summary: initial?.summary ?? '',
      content: (initial?.content as Record<string, unknown>) ?? { type: 'doc', content: [] },
      contentHtml: initial?.contentHtml ?? '',
      coverUrl: initial?.coverUrl ?? '',
      coverPublicId: initial?.coverPublicId ?? '',
      startDate: initial?.startDate ? initial.startDate.slice(0, 10) : '',
      endDate: initial?.endDate ? initial.endDate.slice(0, 10) : '',
      teamSize: initial?.teamSize ?? undefined,
      technologies: initial?.technologies ?? [],
      results: initial?.results ?? '',
      revenue:
        initial?.revenueAmount != null
          ? { amount: Number(initial.revenueAmount), currency: initial.revenueCurrency ?? 'VND' }
          : undefined,
      client: initial?.client ?? '',
      role: initial?.role ?? '',
      links: initial?.links ?? [],
      gallery: initial?.gallery ?? [],
      isPublished: initial?.isPublished ?? false,
    },
  });

  const content = watch('content');
  const technologies = watch('technologies');
  const gallery = watch('gallery') ?? [];
  const coverUrl = watch('coverUrl');
  const isPublished = watch('isPublished');

  const onSubmit = async (values: ProjectInput) => {
    setServerError(null);
    const payload: Record<string, unknown> = { ...values };
    ['slug', 'summary', 'contentHtml', 'coverUrl', 'coverPublicId', 'startDate', 'endDate', 'results', 'client', 'role'].forEach((k) => {
      if (payload[k] === '') payload[k] = undefined;
    });
    if (!values.revenue?.amount && !values.revenue?.currency) {
      payload.revenue = undefined;
    }
    try {
      if (initial?.id) {
        await api.patch(`me/projects/${initial.id}`, { json: payload }).json();
      } else {
        await api.post('me/projects', { json: payload }).json();
      }
      router.push('/dashboard/projects');
      router.refresh();
    } catch (e) {
      setServerError(e instanceof Error ? e.message : 'Lưu thất bại');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
      <Card className="flex flex-col gap-4">
        <CardTitle>Thông tin</CardTitle>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Những trường bắt buộc được đánh dấu đỏ nếu bỏ trống. Mục doanh thu & khách hàng có thể ẩn khỏi public ở trang <strong>Settings</strong>.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <Field
            label="Tên dự án *"
            hint="Rõ ràng, dễ nhớ. Tối đa 160 ký tự."
            error={errors.name?.message}
            className="md:col-span-2"
          >
            <Input placeholder="VD: Taskly — Realtime team planner" {...register('name')} />
          </Field>
          <Field
            label="Slug"
            hint="URL public dạng /projects/slug. Bỏ trống → tự sinh từ tên."
            error={errors.slug?.message}
          >
            <Input placeholder="taskly-realtime-planner" {...register('slug')} />
          </Field>
          <Field
            label="Khách hàng"
            hint="Tên công ty/khách; để trống nếu dự án cá nhân."
            error={errors.client?.message}
          >
            <Input placeholder="VD: Startup XYZ / Nội bộ" {...register('client')} />
          </Field>
          <Field
            label="Vai trò"
            hint="Bạn phụ trách gì trong dự án?"
            error={errors.role?.message}
          >
            <Input placeholder="VD: Tech Lead / Backend Dev" {...register('role')} />
          </Field>
          <Field
            label="Số người tham gia"
            hint="Bao gồm chính bạn."
            error={errors.teamSize?.message}
          >
            <Input type="number" min={1} placeholder="VD: 4" {...register('teamSize')} />
          </Field>
          <Field
            label="Bắt đầu"
            hint="Ngày bắt đầu tham gia dự án."
            error={errors.startDate?.message}
          >
            <Input type="date" {...register('startDate')} />
          </Field>
          <Field
            label="Kết thúc"
            hint="Để trống nếu dự án vẫn đang tiến hành."
            error={errors.endDate?.message}
          >
            <Input type="date" {...register('endDate')} />
          </Field>
          <Field
            label="Tóm tắt (hiển thị card)"
            hint="1–2 câu mô tả — hiển thị ở list projects. Tối đa 500 ký tự."
            className="md:col-span-2"
            error={errors.summary?.message}
          >
            <Textarea
              rows={2}
              placeholder="VD: SaaS quản lý task cho startup, realtime sync qua WebSocket..."
              {...register('summary')}
            />
          </Field>
          <Field
            label="Kết quả đạt được"
            hint="Số liệu cụ thể càng tốt (giảm X%, Y người dùng...)."
            className="md:col-span-2"
            error={errors.results?.message}
          >
            <Textarea
              rows={2}
              placeholder="VD: Giảm 40% thời gian lên sprint, 500+ user active tháng đầu."
              {...register('results')}
            />
          </Field>
          <Field
            label="Doanh thu — Số tiền"
            hint="Giá trị dự án (có thể ẩn khỏi public ở Settings)."
            error={errors.revenue?.amount?.message}
          >
            <Input type="number" min={0} step={1000} placeholder="120000000" {...register('revenue.amount')} />
          </Field>
          <Field
            label="Doanh thu — Đơn vị"
            hint="Mã tiền tệ ISO (VND, USD, EUR...)."
            error={errors.revenue?.currency?.message}
          >
            <Input placeholder="VND" {...register('revenue.currency')} />
          </Field>
        </div>
      </Card>

      <Card className="flex flex-col gap-3">
        <CardTitle>Công nghệ / Công cụ</CardTitle>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Gõ tên công nghệ rồi nhấn <kbd>Enter</kbd> hoặc dấu phẩy để thêm tag. Tối đa 50 tag.
        </p>
        <TagInput value={technologies ?? []} onChange={(v) => setValue('technologies', v, { shouldDirty: true })} />
      </Card>

      <Card className="flex flex-col gap-3">
        <CardTitle>Ảnh đại diện (cover)</CardTitle>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Hiển thị ở đầu trang chi tiết + card list. Khuyến nghị 1600×900 (tỷ lệ 16:9). JPG/PNG/WebP.
        </p>
        <CloudinaryUploader
          multiple={false}
          folder="projects/cover"
          value={coverUrl ? [{ publicId: watch('coverPublicId') ?? '', url: coverUrl, type: 'image' }] : []}
          onChange={(items) => {
            const m = items[0];
            setValue('coverUrl', m?.url ?? '', { shouldDirty: true });
            setValue('coverPublicId', m?.publicId ?? '', { shouldDirty: true });
          }}
        />
      </Card>

      <Card className="flex flex-col gap-3">
        <CardTitle>Thư viện ảnh/video phụ</CardTitle>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Hiển thị dạng grid ở cuối trang chi tiết. Kéo-thả nhiều file; hỗ trợ ảnh &amp; video.
        </p>
        <CloudinaryUploader
          folder="projects/gallery"
          resourceType="auto"
          accept="image/*,video/*"
          value={gallery}
          onChange={(v) => setValue('gallery', v, { shouldDirty: true })}
        />
      </Card>

      <Card className="flex flex-col gap-3">
        <CardTitle>Chi tiết</CardTitle>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Trình soạn thảo rich-text: định dạng chữ (<strong>Ctrl+B</strong>, <em>Ctrl+I</em>), chèn heading/list/link, nhúng ảnh &amp; video YouTube/Vimeo bằng nút trên toolbar.
        </p>
        <TiptapEditor
          folder="projects/content"
          placeholder="Mô tả chi tiết dự án: bối cảnh, vấn đề, giải pháp, kiến trúc..."
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
          <p className="text-sm text-[var(--color-muted-foreground)]">
            Khi bật, dự án sẽ hiển thị public tại <code>/u/username/projects/slug</code>.
          </p>
        </div>
        <Switch
          checked={!!isPublished}
          onChange={(v) => setValue('isPublished', v, { shouldDirty: true })}
        />
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
