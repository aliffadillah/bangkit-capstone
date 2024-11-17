import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { UserFoodsDTO } from './foods.dto';

@Injectable()
export class FoodsService {
  constructor(private prisma: PrismaService) {}

  async createFood(
    username: string,
    data: (typeof UserFoodsDTO.POST)['_type'],
  ) {
    return this.prisma.foods.create({
      data: {
        ...data,
        username,
        date_added: new Date(),
      },
    });
  }

  async getFoodById(foodId: number, username: string) {
    const food = await this.prisma.foods.findFirst({
      where: { id: foodId, username },
    });

    if (!food) {
      throw new NotFoundException('Food not found');
    }

    return food;
  }

  async getHistoryByDate(username: string, date: string)  {
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
      orderBy: { date_added: 'asc'},
    });

    return history;
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

    console.log('Food found for update:', existingFood);

    try {
      const updatedFood = await this.prisma.foods.update({
        where: { id: foodId },
        data,
      });

      console.log('Updated food:', updatedFood);

      return updatedFood;
    } catch (error) {
      console.error('Error updating food:', error);
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
