import { ZodType, z } from 'zod';

export class UserValidation {
  static readonly REGISTER: ZodType = z
    .object({
      username: z.string().min(1).max(100),
      password: z.string().min(1).max(100),
      repeatPassword: z.string().min(1).max(100), // Add repeatPassword field
      name: z.string().min(1).max(100),
      email: z.string().min(1).max(100),
    })
    .refine((data) => data.password === data.repeatPassword, {
      message: 'Password atau Repeat Password tidak sama',
      path: ['repeatPassword'],
    });

  static readonly LOGIN: ZodType = z.object({
    username: z.string().min(1).max(100),
    password: z.string().min(1).max(100),
  });

  static readonly UPDATE: ZodType = z.object({
    name: z.string().min(1).max(100).optional(),
    password: z.string().min(1).max(100).optional(),
  });
}
