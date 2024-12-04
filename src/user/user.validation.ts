import { z } from 'zod';

export class UserValidation {
  static readonly REGISTER = z
    .object({
      username: z.string(),
      password: z
        .string()
        .min(8, { message: 'Password harus memiliki setidaknya 8 karakter' })
        .max(100, { message: 'Password terlalu panjang' })
        .regex(/[A-Z]/, { message: 'Password harus mengandung huruf besar' })
        .regex(/[0-9]/, { message: 'Password harus mengandung angka' })
        .regex(/[^A-Za-z0-9]/, { message: 'Password harus mengandung simbol' }),
      repeatPassword: z.string().min(8).max(100),
      name: z.string().min(1).max(100),
      email: z.string().email().min(5).max(100),
    })
    .strict()
    .refine((data) => data.password === data.repeatPassword, {
      message: 'Password dan Repeat Password tidak cocok',
      path: ['repeatPassword'],
    });

  static readonly LOGIN = z.object({
    username: z.string(),
    password: z
      .string()
      .min(1, { message: 'Password tidak boleh kosong' })
      .max(100, { message: 'Password terlalu panjang' })
      .regex(/[A-Z]/, { message: 'Password harus mengandung huruf besar' })
      .regex(/[0-9]/, { message: 'Password harus mengandung angka' })
      .regex(/[^A-Za-z0-9]/, { message: 'Password harus mengandung simbol' }),
  });

  static readonly UPDATE = z.object({
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
