import { z, ZodType } from 'zod';


export class UserFoodsDTO {
  static readonly POST: ZodType = z.object({
    nama_makanan: z.string().min(1).max(100),
    category: z.string().min(1).max(100),
    calories: z.number().min(1).max(1000),
    sugar: z.number().min(1).max(1000),
    fats: z.number().min(1).max(100),
    salt: z.number().min(1).max(100),
  });

  static readonly UPDATE: ZodType = z.object({
    nama_makanan: z.string().min(1).max(100).optional(),
    category: z.string().min(1).max(100).optional(),
    calories: z.number().min(1).max(1000).optional(),
    sugar: z.number().min(1).max(1000).optional(),
    fats: z.number().min(1).max(100).optional(),
    salt: z.number().min(1).max(100).optional(),
    grade: z.string().min(1).max(10).optional(),
  });
}
