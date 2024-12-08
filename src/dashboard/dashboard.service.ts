import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { PrismaService } from '../common/prisma.service';
import { Dashboard } from './dashboard.dto';
import { calorieAdvices } from '../advice/advice'; // Import additional advice

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

    // Fetch calorie advice from an external API
    const calorieAdvice = await this.getCalorieAdvice(username);

    return {
      progress_percentage: progressPercentage,
      daily_calories: totalCalories,
      calories_goal: userProfile.kcal,
      daily_sugar: totalSugar,
      daily_fat: totalFat,
      daily_salt: totalSalt,
      bmi: userProfile.bmi,
      advices: calorieAdvice,
    };
  }

  async getWeeklyCalories(username: string): Promise<any> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 6); // Past 7 days

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
    }).reverse(); // Order from the first day to the last day

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

  async getCalorieAdvice(username: string): Promise<string> {
    const totalCalories = await this.getWeeklyCalories(username);
    const totalCaloriesSum = totalCalories.calories.reduce(
      (acc, val) => acc + val,
      0,
    );
    const advicePrefix = `Asupan kalori Anda untuk minggu ini totalnya mencapai (${totalCaloriesSum} kalori).`;

    // Check if the calories list has exactly 7 elements
    if (totalCalories.calories.length !== 7) {
      return `${advicePrefix} Data kalori tidak lengkap. List untuk 'calories' harus berisi tepat 7 elemen.`;
    }

    try {
      // Create payload for POST request
      const payload = {
        calories: totalCalories.calories,
        sugar: totalCalories.sugar,
        fat: totalCalories.fat,
        salt: totalCalories.salt,
      };

      // Use the environment variable for the API URL
      const apiUrl = process.env.ML_API_URL_CALORIES;
      if (!apiUrl) {
        throw new Error(
          'ML API URL is not defined in the environment variables.',
        );
      }

      // Call ML API using POST method with payload
      const response = await axios.post(apiUrl, payload);
      const predictedCalories = response.data.predicted_calories;

      // Fetch user profile to get the calorie goal
      const userProfile = await this.prisma.profile.findUnique({
        where: { username },
      });
      if (!userProfile) {
        throw new Error('User profile not found');
      }

      const maxAdviceThreshold = userProfile.kcal * 0.125;

      let advice = '';
      if (predictedCalories < maxAdviceThreshold) {
        advice = `Wah, prediksi asupan snack Anda untuk esok hari hanya ${predictedCalories} kalori. Kayaknya camilan Anda kurang seru, nih! Yuk, tambahin buah atau kacang-kacangan untuk tetap sehat dan seru! 🍎🥜`;
      } else if (
        predictedCalories >= maxAdviceThreshold &&
        predictedCalories <= userProfile.kcal
      ) {
        advice = `Cihuy! Prediksi asupan snack Anda untuk esok hari adalah ${predictedCalories} kalori. Pilihan snack Anda mantap banget! Tetap pilih yang sehat ya, biar tetap kece dan semangat sepanjang hari! 💃✨`;
      } else if (predictedCalories > userProfile.kcal) {
        advice = `Oops! Prediksi asupan snack Anda untuk esok hari mencapai ${predictedCalories} kalori. Snack-nya memang menggoda, tapi coba kurangi yang manis-manis, ya! Yuk, pilih camilan yang lebih sehat biar tubuh tetap bugar! 🌱💕`;
      }

      // Add additional advice
      const additionalAdvice =
        calorieAdvices[Math.floor(Math.random() * calorieAdvices.length)];
      return `${advicePrefix} ${advice} ${additionalAdvice}`;
    } catch (error) {
      console.error('Error fetching calorie advice:', error);
      return `${advicePrefix} Kami mengalami kesulitan mengambil data saran. Silakan coba lagi nanti.`;
    }
  }
}
