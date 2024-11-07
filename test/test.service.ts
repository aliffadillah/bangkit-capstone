import { PrismaService } from '../src/common/prisma.service';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TestService {
  constructor(private prismaService: PrismaService) {}

  async deleteUser() {
    await this.prismaService.user.deleteMany({
      where: {
        username: 'alifmuhammad',
      },
    });
  }

  async getUser() {
    return this.prismaService.user.findUnique({
      where: {
        username: 'alifmuhammad',
      },
    });
  }

  async createUser() {
    await this.prismaService.user.create({
      data: {
        username: 'alifmuhammad',
        name: 'Muhammad Alif',
        email: 'alifmuhammad@test.com',
        password: await bcrypt.hash('test', 10),
        token: 'aliftoken',
      },
    });
  }
}
