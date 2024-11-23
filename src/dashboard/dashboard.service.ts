import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Dashboard } from './dashboard.dto';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async calculateDashboardData(username: string, date: Date): Promise<Dashboard> {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    const foods = await this.prisma.foods.findMany({
      where: {
        username: username,
        date_added: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
    });

    console.log('Foods data:', foods);

    if (!foods || foods.length === 0) {
      throw new Error('No food data available for this date');
    }

    const totalCalories = foods.reduce((acc, food) => acc + food.calories, 0);
    const totalSugar = foods.reduce((acc, food) => acc + food.sugar, 0);
    const totalFat = foods.reduce((acc, food) => acc + food.fats, 0);
    const totalSalt = foods.reduce((acc, food) => acc + food.salt, 0);

    const userProfile = await this.prisma.profile.findUnique({
      where: { username },
    });

    const bmi = userProfile ? userProfile.bmi : null;

    const progressPercentage = Math.round((totalCalories / userProfile.kcal) * 100);

    return {
      progress_percentage: progressPercentage,
      daily_calories: totalCalories,
      calories_goal: userProfile.kcal,
      daily_sugar: totalSugar,
      daily_fat: totalFat,
      daily_salt: totalSalt,
      bmi,
      advices: 'Seimbangkan asupan Anda dengan menambah serat...', //kaga tau gua advice mau diisi apaa
    };
  }


}
