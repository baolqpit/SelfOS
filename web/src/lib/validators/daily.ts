import { z } from 'zod';

const mediaItem = z.object({
  publicId: z.string(),
  url: z.string().url(),
  type: z.enum(['image', 'video', 'raw']),
  width: z.number().optional(),
  height: z.number().optional(),
  duration: z.number().optional(),
  format: z.string().optional(),
  alt: z.string().optional(),
});

export const dailySchema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().min(2).max(200).optional().or(z.literal('')),
  content: z.record(z.unknown()).default({ type: 'doc', content: [] }),
  contentHtml: z.string().optional().or(z.literal('')),
  coverUrl: z.string().url().optional().or(z.literal('')),
  videos: z.array(mediaItem).optional(),
  images: z.array(mediaItem).optional(),
  tags: z.array(z.string()).max(50).default([]),
  publishedAt: z.string().optional().or(z.literal('')),
  isPublished: z.boolean().default(false),
});
export type DailyInput = z.infer<typeof dailySchema>;
