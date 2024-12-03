import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Dashboard } from './dashboard.dto';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async dashboardUsers(username: string, date: Date): Promise<Dashboard> {
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

    if (!foods || foods.length === 0) {
      throw new Error('Data Dashboard tidak tersedia');
    }

    const totalCalories = foods.reduce((acc, food) => acc + food.calories, 0);
    const totalSugar = foods.reduce((acc, food) => acc + food.sugar, 0);
    const totalFat = foods.reduce((acc, food) => acc + food.fats, 0);
    const totalSalt = foods.reduce((acc, food) => acc + food.salt, 0);

    const userProfile = await this.prisma.profile.findUnique({
      where: { username },
    });

    if (!userProfile) {
      throw new Error('User profile not found');
    }

    const progressPercentage = Math.round(
      (totalCalories / (userProfile.kcal || 1)) * 100,
    );

    const existingDashboard = await this.prisma.dashboard.findFirst({
      where: {
        profileId: userProfile.id,
        dashboard_time: startOfDay,
      },
    });

    if (existingDashboard) {
      await this.prisma.dashboard.update({
        where: { id: existingDashboard.id },
        data: {
          progress_percentage: progressPercentage,
          current_kcal: totalCalories,
          calories_goal: userProfile.kcal || 0,
          daily_sugar: totalSugar,
          daily_fat: totalFat,
          daily_salt: totalSalt,
          bmi: userProfile.bmi || 0,
        },
      });
    } else {
      await this.prisma.dashboard.create({
        data: {
          profileId: userProfile.id,
          progress_percentage: progressPercentage,
          current_kcal: totalCalories,
          calories_goal: userProfile.kcal || 0,
          dashboard_time: startOfDay,
          daily_sugar: totalSugar,
          daily_fat: totalFat,
          daily_salt: totalSalt,
          bmi: userProfile.bmi || 0,
        },
      });
    }

    return {
      progress_percentage: progressPercentage,
      daily_calories: totalCalories,
      calories_goal: userProfile.kcal,
      daily_sugar: totalSugar,
      daily_fat: totalFat,
      daily_salt: totalSalt,
      bmi: userProfile.bmi,
      advices: 'Seimbangkan asupan Anda dengan menambah serat...',
    };
  }

  async getWeeklyCalories(username: string): Promise<any> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 6); // 7 hari ke belakang

    const foods = await this.prisma.foods.findMany({
      where: {
        username: username,
        date_added: {
          gte: startDate,
          lt: endDate,
        },
      },
    });

    if (!foods || foods.length === 0) {
      throw new Error('No data available for the past 7 days');
    }

    const dailyData = Array.from({ length: 7 }, (_, i) => {
      const currentDate = new Date();
      currentDate.setDate(endDate.getDate() - i);
      const dayFoods = foods.filter(
        (food) => food.date_added.toDateString() === currentDate.toDateString(),
      );

      const totalCalories = dayFoods.reduce(
        (acc, food) => acc + food.calories,
        0,
      );
      const totalSugar = dayFoods.reduce((acc, food) => acc + food.sugar, 0);
      const totalFat = dayFoods.reduce((acc, food) => acc + food.fats, 0);
      const totalSalt = dayFoods.reduce((acc, food) => acc + food.salt, 0);

      return {
        calories: totalCalories,
        sugar: totalSugar,
        fat: totalFat,
        salt: totalSalt,
      };
    }).reverse(); // Untuk urutan dari hari pertama ke hari terakhir

    const calories = dailyData.map((data) => data.calories);
    const sugar = dailyData.map((data) => data.sugar);
    const fat = dailyData.map((data) => data.fat);
    const salt = dailyData.map((data) => data.salt);

    return {
      calories,
      sugar,
      fat,
      salt,
    };
  }
}
