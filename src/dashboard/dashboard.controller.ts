import {
  Controller,
  Get,
  Param,
  Query,
  Headers,
  HttpException,
  HttpCode,
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtService } from '@nestjs/jwt';
import { WebResponse } from '../model/web.model';

@Controller('api/dashboard')
export class DashboardController {
  constructor(
    private readonly dashboardService: DashboardService,
    private readonly jwtService: JwtService,
  ) {}

  private validateToken(token: string, username: string) {
    if (!token) {
      throw new HttpException('Authorization token is missing', 401);
    }

    const decoded = this.jwtService.decode(token.replace('Bearer ', '')) as any;

    if (
      !decoded ||
      typeof decoded !== 'object' ||
      decoded.username !== username
    ) {
      throw new HttpException('Invalid token or unauthorized user', 401);
    }
  }

  // Endpoint untuk melihat data dashboard per hari
  @Get(':username')
  @HttpCode(200)
  async getDashboardData(
    @Headers('authorization') token: string,
    @Param('username') username: string,
    @Query('date') date: string,
  ): Promise<WebResponse<any>> {
    try {
      this.validateToken(token, username);

      if (!username || !date) {
        throw new HttpException('Username and date are required', 400);
      }

      const dashboardData = await this.dashboardService.dashboardUsers(
        username,
        new Date(date),
      );

      return {
        data: dashboardData,
        message: `Dashboard data retrieved successfully for ${username}`,
      };
    } catch (error) {
      if (error.message === 'Data Dashboard tidak tersedia') {
        throw new HttpException({ errors: { message: error.message } }, 404);
      }

      throw new HttpException(
        {
          errors: { message: error.message },
        },
        error.status || 500,
      );
    }
  }

  // Endpoint untuk melihat nutrisi dalam 7 hari terakhir (tanpa JWT)
  @Get(':username/weekly-calories')
  @HttpCode(200)
  async getWeeklyCalories(
    @Param('username') username: string,
  ): Promise<WebResponse<any>> {
    try {
      const weeklyData =
        await this.dashboardService.getWeeklyCalories(username);

      return {
        data: weeklyData,
        message: `Weekly nutrition data retrieved successfully for ${username}`,
      };
    } catch (error) {
      throw new HttpException(
        {
          errors: { message: error.message },
        },
        error.status || 500,
      );
    }
  }
}
