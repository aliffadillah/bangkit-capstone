import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Headers,
  NotFoundException,
} from '@nestjs/common';
import { FoodsService } from './foods.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';

@Controller('api/food')
export class FoodsController {
  constructor(
    private readonly foodsService: FoodsService,
    private readonly jwtService: JwtService,
  ) {}
  private validateToken(authHeader: string): { username: string } {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing or invalid token');
    }

    const token = authHeader.split(' ')[1];
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  @Post()
  async addFood(
    @Headers('authorization') authHeader: string,
    @Query('username') username: string,
    @Body() data: any,
  ) {
    const payload = this.validateToken(authHeader);

    if (payload.username !== username) {
      throw new UnauthorizedException('Unauthorized user');
    }

    try {
      const food = await this.foodsService.createFood(username, data);
      return {
        message: 'Food item added successfully.',
        data: {
          food_id: food.id.toString(),
          date_added: food.date_added.toISOString(),
        },
      };
    } catch (error) {
      return {
        errors: 'Data tidak ditemukan',
      };
    }
  }

  @Get(':id')
  async getFood(
    @Param('id') foodId: string,
    @Query('username') username: string,
    @Headers('authorization') authHeader: string,
  ) {
    const payload = this.validateToken(authHeader);

    if (payload.username !== username) {
      throw new UnauthorizedException('Unauthorized user');
    }

    return await this.foodsService.getFoodById(Number(foodId), username);
  }

  @Patch(':id')
  async updateFood(
    @Headers('authorization') authHeader: string,
    @Param('id') foodId: string,
    @Query('username') username: string,
    @Body() data: any,
  ) {
    const payload = this.validateToken(authHeader);

    if (payload.username !== username) {
      throw new UnauthorizedException('Unauthorized user');
    }

    const parsedFoodId = parseInt(foodId, 10);

    return this.foodsService.updateFood(parsedFoodId, username, data);
  }

  @Delete(':food_id')
  async deleteFood(
    @Headers('authorization') authHeader: string,
    @Param('food_id') foodId: string,
    @Query('username') username: string,
  ) {
    const payload = this.validateToken(authHeader);

    if (payload.username !== username) {
      throw new UnauthorizedException('Unauthorized user');
    }

    const parsedFoodId = parseInt(foodId, 10);

    try {
      const response = await this.foodsService.deleteFood(
        parsedFoodId,
        username,
      );
      return response;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { errors: 'Data tidak ditemukan' };
      }
      return { errors: 'Terjadi kesalahan server' };
    }
  }
}
