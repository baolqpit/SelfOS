import { z } from 'zod';

export const loginSchema = z.object({
  emailOrUsername: z.string().min(3).max(254),
  password: z.string().min(8).max(128),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    email: z.string().email().max(254),
    username: z
      .string()
      .min(3)
      .max(32)
      .regex(/^[a-z0-9][a-z0-9_-]{2,31}$/i, 'Invalid username'),
    password: z.string().min(8).max(128),
    confirm: z.string().min(8).max(128),
  })
  .refine((d) => d.password === d.confirm, {
    message: 'Passwords do not match',
    path: ['confirm'],
  });
export type RegisterInput = z.infer<typeof registerSchema>;
