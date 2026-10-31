import { z } from 'zod';

export const profileSchema = z.object({
  fullName: z.string().min(1).max(160),
  dateOfBirth: z.string().optional().or(z.literal('')),
  address: z.string().max(500).optional().or(z.literal('')),
  email: z.string().email().max(254),
  phone: z.string().max(32).optional().or(z.literal('')),
  occupation: z.string().max(160).optional().or(z.literal('')),
  bio: z.string().max(500).optional().or(z.literal('')),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  avatarPublicId: z.string().optional().or(z.literal('')),
  coverUrl: z.string().url().optional().or(z.literal('')),
  coverPublicId: z.string().optional().or(z.literal('')),
  socialLinks: z.record(z.string()).optional(),
});
export type ProfileInput = z.infer<typeof profileSchema>;
