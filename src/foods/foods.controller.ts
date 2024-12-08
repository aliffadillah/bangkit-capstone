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
  HttpCode,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FoodsService } from './foods.service';
import { JwtService } from '@nestjs/jwt';
import { UserFoodsDTO } from './foods.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/food')
export class FoodsController {
  constructor(
      private readonly foodsService: FoodsService,
      private readonly jwtService: JwtService,
  ) {}

  private validateToken(token: string, username: string) {
    if (!token) {
      this.foodsService.throwError('Token tidak tersedia', 401, [
        'authorization',
      ]);
    }

    const decoded = this.jwtService.decode(token.replace('Bearer ', '')) as any;

    if (
        !decoded ||
        typeof decoded !== 'object' ||
        decoded.username !== username
    ) {
      this.foodsService.throwError(
          'Token tidak valid atau pengguna tidak ditemukan',
          401,
          ['authorization'],
      );
    }
  }

  @Post(':username')
  @HttpCode(200)
  async addFood(
      @Headers('authorization') token: string,
      @Param('username') username: string,
      @Body() data: (typeof UserFoodsDTO.POST)['_type'],
  ) {
    this.validateToken(token, username);
    return await this.foodsService.createFood(username, data);
  }

  @Post('ocr/:username')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  async addFoodOCR(
      @Headers('authorization') token: string,
      @Param('username') username: string,
      @UploadedFile() file: Express.Multer.File,
  ) {
    this.validateToken(token, username);

    if (!file) {
      this.foodsService.throwError('File tidak tersedia', 400, ['file']);
    }

    return await this.foodsService.processOCR(file.buffer);
  }

  @Get(':food_id&:username')
  @HttpCode(200)
  async getFood(
      @Headers('authorization') token: string,
      @Param('food_id') foodId: string,
      @Param('username') username: string,
  ) {
    this.validateToken(token, username);
    return await this.foodsService.getFoodById(Number(foodId), username);
  }

  @Get(':username')
  @HttpCode(200)
  async getHistory(
      @Headers('authorization') token: string,
      @Param('username') username: string,
      @Query('date') date: string,
  ) {
    this.validateToken(token, username);
    return await this.foodsService.getHistoryByDate(username, date);
  }

  @Patch(':food_id&:username')
  @HttpCode(200)
  async updateFood(
      @Headers('authorization') token: string,
      @Param('food_id') foodId: string,
      @Param('username') username: string,
      @Body() data: (typeof UserFoodsDTO.UPDATE)['_type'],
  ) {
    this.validateToken(token, username);
    return await this.foodsService.updateFood(Number(foodId), username, data);
  }

  @Delete(':food_id&:username')
  @HttpCode(200)
  async deleteFood(
      @Headers('authorization') token: string,
      @Param('food_id') foodId: string,
      @Param('username') username: string,
  ) {
    this.validateToken(token, username);
    return await this.foodsService.deleteFood(Number(foodId), username);
  }
}
