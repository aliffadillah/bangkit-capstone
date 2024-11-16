import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { UserFoodsDTO } from './foods.dto'; // Import DTO untuk tipe data yang sesuai

@Injectable()
export class FoodsService {
  constructor(private prisma: PrismaService) {}

  // Fungsi untuk menambah makanan
  async createFood(
    username: string,
    data: (typeof UserFoodsDTO.POST)['_type'],
  ) {
    // Sesuaikan dengan tipe data POST
    return this.prisma.foods.create({
      data: {
        ...data,
        username,
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

  // Fungsi untuk memperbarui makanan berdasarkan ID
  async updateFood(foodId: number, username: string, data: any) {
    const existingFood = await this.prisma.foods.findFirst({
      where: {
        id: foodId, // Pastikan ini adalah angka, bukan string
        username,
      },
    });

    if (!existingFood) {
      throw new NotFoundException('Food not found');
    }

    console.log('Food found for update:', existingFood); // Log sebelum update

    try {
      const updatedFood = await this.prisma.foods.update({
        where: { id: foodId }, // Pastikan ini menggunakan tipe number
        data,
      });

      console.log('Updated food:', updatedFood); // Log hasil update

      return updatedFood;
    } catch (error) {
      console.error('Error updating food:', error); // Log error
      throw new Error('Internal server error');
    }
  }

  // Fungsi untuk menghapus makanan berdasarkan ID
  async deleteFood(foodId: number, username: string) {
    const existingFood = await this.prisma.foods.findFirst({
      where: {
        id: foodId,
        username,
      },
    });

    if (!existingFood) {
      // Mengembalikan response error jika data tidak ditemukan
      throw new NotFoundException('Data tidak ditemukan');
    }

    // Proses penghapusan data makanan
    await this.prisma.foods.delete({
      where: { id: foodId },
    });

    // Mengembalikan response sukses
    return { message: 'Data berhasil dihapus' };
  }
}
