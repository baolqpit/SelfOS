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

export const knowledgeSchema = z.object({
  title: z.string().min(2).max(200),
  slug: z.string().min(2).max(200).optional().or(z.literal('')),
  content: z.record(z.unknown()).default({ type: 'doc', content: [] }),
  contentHtml: z.string().optional().or(z.literal('')),
  method: z.string().optional().or(z.literal('')),
  source: z.string().optional().or(z.literal('')),
  startedAt: z.string().optional().or(z.literal('')),
  completedAt: z.string().optional().or(z.literal('')),
  certificateUrl: z.string().url().optional().or(z.literal('')),
  certificatePublicId: z.string().optional().or(z.literal('')),
  images: z.array(mediaItem).optional(),
  tags: z.array(z.string()).max(50).default([]),
  isPublished: z.boolean().default(false),
});
export type KnowledgeInput = z.infer<typeof knowledgeSchema>;
