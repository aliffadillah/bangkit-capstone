import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { UserFoodsDTO } from './foods.dto';
import axios from 'axios';
import * as FormData from 'form-data';

@Injectable()
export class FoodsService {
  constructor(private prisma: PrismaService) {}

  throwError(message: string, statusCode: number, details: string[] = []) {
    throw new HttpException(
        {
          statusCode,
          message,
          details,
        },
        statusCode,
    );
  }

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

    let fatGrade = sugarGrade;
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

  async createFood(username: string, data: (typeof UserFoodsDTO.POST)['_type']) {
    try {
      const grade = this.calculateGrade(data.sugar, data.fats);

      const food = await this.prisma.foods.create({
        data: {
          ...data,
          username,
          grade,
          date_added: new Date(),
        },
      });

      return { data: food };
    } catch (error) {
      this.throwError('Gagal menambahkan makanan', 500, ['createFood']);
    }
  }


  async processOCR(fileBuffer: Buffer) {
    const OCR_BASE_URL = process.env.OCR_BASE_URL;

    if (!OCR_BASE_URL) {
      this.throwError('OCR_BASE_URL tidak ditemukan dalam konfigurasi', 500, ['OCR_BASE_URL']);
    }

    const formData = new FormData();
    formData.append('file', fileBuffer, 'image.jpg');

    try {
      const response = await axios.post(OCR_BASE_URL, formData, {
        headers: {
          ...formData.getHeaders(),
        },
      });

      return response.data;
    } catch (error) {
      this.throwError('Gagal memproses OCR', 500, ['processOCR']);
    }
  }

  async getFoodById(foodId: number, username: string) {
    const food = await this.prisma.foods.findFirst({
      where: { id: foodId, username },
    });

    if (!food) {
      this.throwError('Data makanan tidak ditemukan', 404, ['foodId']);
    }

    return { data: food };
  }

  async getHistoryByDate(username: string, date: string) {
    if (!date || isNaN(Date.parse(date))) {
      this.throwError('Parameter tanggal tidak valid', 400, ['date']);
    }

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

    if (history.length === 0) {
      this.throwError('Data Foods Tidak Ditemukan', 404, ['date']);
    }

    return { data: history };
  }

  async updateFood(foodId: number, username: string, data: any) {
    const existingFood = await this.prisma.foods.findFirst({
      where: {
        id: foodId,
        username,
      },
    });

    if (!existingFood) {
      this.throwError('Data makanan tidak ditemukan', 404, ['foodId']);
    }

    if (data.sugar || data.fats) {
      data.grade = this.calculateGrade(
          data.sugar || existingFood.sugar,
          data.fats || existingFood.fats,
      );
    }

    try {
      const updatedFood = await this.prisma.foods.update({
        where: { id: foodId },
        data,
      });

      return { data: updatedFood };
    } catch (error) {
      this.throwError('Gagal memperbarui makanan', 500, ['updateFood']);
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
      this.throwError('Data makanan tidak ditemukan', 404, ['foodId']);
    }

    try {
      await this.prisma.foods.delete({
        where: { id: foodId },
      });

      return { message: 'Data berhasil dihapus' };
    } catch (error) {
      this.throwError('Gagal menghapus makanan', 500, ['deleteFood']);
    }
  }
}
