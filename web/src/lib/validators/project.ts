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

export const projectSchema = z.object({
  name: z.string().min(2).max(160),
  slug: z.string().min(2).max(200).optional().or(z.literal('')),
  summary: z.string().max(500).optional().or(z.literal('')),
  content: z.record(z.unknown()).default({ type: 'doc', content: [] }),
  contentHtml: z.string().optional().or(z.literal('')),
  coverUrl: z.string().url().optional().or(z.literal('')),
  coverPublicId: z.string().optional().or(z.literal('')),
  startDate: z.string().optional().or(z.literal('')),
  endDate: z.string().optional().or(z.literal('')),
  teamSize: z.coerce.number().int().positive().optional(),
  technologies: z.array(z.string()).max(50).default([]),
  results: z.string().optional().or(z.literal('')),
  revenue: z
    .object({
      amount: z.coerce.number().min(0),
      currency: z.string().min(1),
    })
    .optional(),
  client: z.string().optional().or(z.literal('')),
  role: z.string().optional().or(z.literal('')),
  links: z
    .array(z.object({ label: z.string(), url: z.string().url() }))
    .optional(),
  gallery: z.array(mediaItem).optional(),
  isPublished: z.boolean().default(false),
});
export type ProjectInput = z.infer<typeof projectSchema>;
