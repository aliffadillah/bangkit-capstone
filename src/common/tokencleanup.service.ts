import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { Cron, Interval } from '@nestjs/schedule';

@Injectable()
export class TokenCleanupService {
  constructor(private prismaService: PrismaService) {}

  // This method will run every hour to clean up expired tokens
  @Interval(3600000) // 3600000ms = 1 hour
  async removeExpiredTokens() {
    const oneHourAgo = new Date();
    oneHourAgo.setHours(oneHourAgo.getHours() - 1); // Get the timestamp for 1 hour ago

    // Update users whose token was created more than an hour ago
    await this.prismaService.user.updateMany({
      where: {
        token: {
          not: null,
        },
        updatedAt: {
          lt: oneHourAgo,  // Token is older than 1 hour
        },
      },
      data: {
        token: null,  // Set token to null
      },
    });

    console.log('Expired tokens removed.');
  }
}
