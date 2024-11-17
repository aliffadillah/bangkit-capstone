import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { UserFoodsDTO } from './foods.dto';

@Injectable()
export class FoodsService {
  constructor(private prisma: PrismaService) {}

  // Fungsi untuk menghitung grade berdasarkan kadar gula dan lemak
  private calculateGrade(sugar: number, fats: number): string {
    // Tentukan grade berdasarkan kadar gula
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

    // Tentukan grade berdasarkan lemak
    let fatGrade: string = sugarGrade; // Default grade mengikuti grade gula

    if (fats > 10) {
      // Jika lemak > 10g, maka grade turun satu tingkat
      if (sugarGrade === 'A') {
        fatGrade = 'B';
      } else if (sugarGrade === 'B') {
        fatGrade = 'C';
      } else if (sugarGrade === 'C') {
        fatGrade = 'D';
      }
    }

    // Return grade yang lebih rendah antara grade gula dan lemak
    return fatGrade;
  }

  // Fungsi untuk membuat makanan baru
  async createFood(
    username: string,
    data: (typeof UserFoodsDTO.POST)['_type'],
  ) {
    // Menghitung grade berdasarkan data sugar dan fats
    const grade = this.calculateGrade(data.sugar, data.fats);

    return this.prisma.foods.create({
      data: {
        ...data,
        username,
        grade, // Menyimpan grade yang dihitung
        date_added: new Date(),
      },
    });
  }

  // Fungsi untuk mendapatkan makanan berdasarkan ID
  async getFoodById(foodId: number, username: string) {
    const food = await this.prisma.foods.findFirst({
      where: { id: foodId, username },
    });

    if (!food) {
      throw new NotFoundException('Food not found');
    }

    return food;
  }

  // Fungsi untuk mendapatkan histori makanan berdasarkan tanggal
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

    return history;
  }

  // Fungsi untuk memperbarui makanan
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

    // Jika ada perubahan pada sugar atau fats, hitung ulang grade
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

      return updatedFood;
    } catch (error) {
      throw new Error('Internal server error');
    }
  }

  // Fungsi untuk menghapus makanan
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
