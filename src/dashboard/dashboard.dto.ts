import { ZodType, z } from 'zod';

export class Dashboard {
  static readonly GET: ZodType = z.object({
    progress_percentage: z.number().min(1).max(100),
    daily_calories: z.number().min(1).max(100),
    calories_goal: z.number().min(1).max(100),
    daily_sugar: z.number().min(1).max(100),
    daily_fat: z.number().min(1).max(100),
    daily_salt: z.number().min(1).max(100),
    bmi: z.number().min(1).max(100),
    advices: z.string().min(1).max(1024),
  })
}