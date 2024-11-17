import { ZodType, z } from 'zod';

export class UserValidation {
  static readonly REGISTER: ZodType = z
    .object({
      username: z
        .string()
        .min(3, { message: 'Username terlalu pendek' })
        .max(100, { message: 'Username terlalu panjang' })
        .regex(/^[a-zA-Z0-9_]+$/, {
          message:
            'Username hanya boleh mengandung huruf, angka, dan underscore',
        }),
      password: z
        .string()
        .min(8, { message: 'Password harus memiliki setidaknya 8 karakter' })
        .max(100, { message: 'Password terlalu panjang' })
        .regex(/[A-Z]/, { message: 'Password harus mengandung huruf besar' })
        .regex(/[0-9]/, { message: 'Password harus mengandung angka' })
        .regex(/[^A-Za-z0-9]/, { message: 'Password harus mengandung simbol' }),
      repeatPassword: z
        .string()
        .min(8, {
          message: 'Repeat Password harus memiliki setidaknya 8 karakter',
        })
        .max(100, { message: 'Repeat Password terlalu panjang' })
        .regex(/[A-Z]/, {
          message: 'Repeat Password harus mengandung huruf besar',
        })
        .regex(/[0-9]/, { message: 'Repeat Password harus mengandung angka' })
        .regex(/[^A-Za-z0-9]/, {
          message: 'Repeat Password harus mengandung simbol',
        }),
      name: z
        .string()
        .min(1, { message: 'Nama tidak boleh kosong' })
        .max(100, { message: 'Nama terlalu panjang' }),
      email: z
        .string()
        .email({ message: 'Format email tidak valid' })
        .min(5, { message: 'Email terlalu pendek' })
        .max(100, { message: 'Email terlalu panjang' }),
    })
    .refine((data) => data.password === data.repeatPassword, {
      message: 'Password dan Repeat Password tidak cocok',
      path: ['repeatPassword'],
    });

  static readonly LOGIN: ZodType = z.object({
    username: z
      .string()
      .min(1, { message: 'Username tidak boleh kosong' })
      .max(100, { message: 'Username terlalu panjang' })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: 'Username hanya boleh mengandung huruf, angka, dan underscore',
      }),
    password: z
      .string()
      .min(1, { message: 'Password tidak boleh kosong' })
      .max(100, { message: 'Password terlalu panjang' })
      .regex(/[A-Z]/, { message: 'Password harus mengandung huruf besar' })
      .regex(/[0-9]/, { message: 'Password harus mengandung angka' })
      .regex(/[^A-Za-z0-9]/, { message: 'Password harus mengandung simbol' }),
  });

  static readonly UPDATE: ZodType = z.object({
    name: z
      .string()
      .min(1, { message: 'Nama tidak boleh kosong' })
      .max(100, { message: 'Nama terlalu panjang' })
      .optional(),
    password: z
      .string()
      .min(8, { message: 'Password harus memiliki setidaknya 8 karakter' })
      .max(100, { message: 'Password terlalu panjang' })
      .regex(/[A-Z]/, { message: 'Password harus mengandung huruf besar' })
      .regex(/[0-9]/, { message: 'Password harus mengandung angka' })
      .regex(/[^A-Za-z0-9]/, { message: 'Password harus mengandung simbol' })
      .optional(),
    email: z
      .string()
      .email({ message: 'Format email tidak valid' })
      .min(5, { message: 'Email terlalu pendek' })
      .max(100, { message: 'Email terlalu panjang' })
      .optional(),
  });
}
