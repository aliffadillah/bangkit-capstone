import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { UserFoodsDTO } from './foods.dto';

@Injectable()
export class FoodsService {
  constructor(private prisma: PrismaService) {}

  private calculateGrade(sugar: number, fats: number): string {
    let sugarGrade: string;
    if (sugar <= 1) {
      sugarGrade = 'A';
    } else if (sugar <= 5) {
      sugarGrade = 'B';
    } else if (sugar <= 10) {
      sugarGrade = 'C';
    } else {
      sugarGrade = 'D';
    }

    let fatGrade: string = sugarGrade;
    if (fats > 10) {
      if (sugarGrade === 'A') {
        fatGrade = 'B';
      } else if (sugarGrade === 'B') {
        fatGrade = 'C';
      } else if (sugarGrade === 'C') {
        fatGrade = 'D';
      }
    }

    return fatGrade;
  }

  private mapCategoryToDisplay(category: string): string {
    const FoodCategoryMapping = {
      MAKANAN_BERAT: 'Makanan Berat',
      MAKANAN_RINGAN: 'Makanan Ringan',
      MINUMAN_NON_SODA: 'Minuman Non-Soda',
      MINUMAN_BERSODA: 'Minuman Bersoda',
      MINUMAN_SEHAT: 'Minuman Sehat',
      PRODUK_BEKU: 'Produk Beku',
    };
    return FoodCategoryMapping[category] || category;
  }

  async createFood(
    username: string,
    data: (typeof UserFoodsDTO.POST)['_type'],
  ) {
    const grade = this.calculateGrade(data.sugar, data.fats);

    const food = await this.prisma.foods.create({
      data: {
        ...data,
        username,
        grade,
        date_added: new Date(),
      },
    });

    // Return with mapped category for display
    return {
      ...food,
      category: this.mapCategoryToDisplay(food.category),
    };
  }

  async getFoodById(foodId: number, username: string) {
    const food = await this.prisma.foods.findFirst({
      where: { id: foodId, username },
    });

    if (!food) {
      throw new NotFoundException('Food not found');
    }

    // Return with mapped category for display
    return {
      ...food,
      category: this.mapCategoryToDisplay(food.category),
    };
  }

  async getHistoryByDate(username: string, date: string) {
    const startDate = new Date(date);
    const endDate = new Date(date);
    endDate.setDate(startDate.getDate() + 1);

    const history = await this.prisma.foods.findMany({
      where: {
        username,
        date_added: {
          gte: startDate,
          lt: endDate,
        },
      },
      orderBy: { date_added: 'asc' },
    });

    // Map categories for display
    return history.map((food) => ({
      ...food,
      category: this.mapCategoryToDisplay(food.category),
    }));
  }

  async updateFood(foodId: number, username: string, data: any) {
    const existingFood = await this.prisma.foods.findFirst({
      where: {
        id: foodId,
        username,
      },
    });

    if (!existingFood) {
      throw new NotFoundException('Food not found');
    }

    if (data.sugar || data.fats) {
      const grade = this.calculateGrade(
        data.sugar || existingFood.sugar,
        data.fats || existingFood.fats,
      );
      data.grade = grade;
    }

    try {
      const updatedFood = await this.prisma.foods.update({
        where: { id: foodId },
        data,
      });

      // Return with mapped category for display
      return {
        ...updatedFood,
        category: this.mapCategoryToDisplay(updatedFood.category),
      };
    } catch (error) {
      throw new Error('Internal server error');
    }
  }

  async deleteFood(foodId: number, username: string) {
    const existingFood = await this.prisma.foods.findFirst({
      where: {
        id: foodId,
        username,
      },
    });

    if (!existingFood) {
      throw new NotFoundException('Data tidak ditemukan');
    }

    await this.prisma.foods.delete({
      where: { id: foodId },
    });

    return { message: 'Data berhasil dihapus' };
  }
}
