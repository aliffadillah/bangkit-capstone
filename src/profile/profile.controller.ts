import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  Headers,
  UseInterceptors,
  UploadedFile,
  HttpCode,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto, UpdateProfileDto } from './profile.dto';
import { JwtService } from '@nestjs/jwt';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('api/profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly jwtService: JwtService,
  ) {}

  private validateToken(token: string, username: string) {
    if (!token) {
      this.profileService.throwError('Token tidak tersedia', 401, [
        'authorization',
      ]);
    }

    const decoded = this.jwtService.decode(token.replace('Bearer ', '')) as any;

    if (
      !decoded ||
      typeof decoded !== 'object' ||
      decoded.username !== username
    ) {
      this.profileService.throwError(
        'Token tidak valid atau pengguna tidak ditemukan',
        401,
        ['authorization'],
      );
    }
  }

  @Post(':username')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  async createProfile(
    @Headers('authorization') token: string,
    @Param('username') username: string,
    @Body() createProfileDto: CreateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    this.validateToken(token, username);

    const profileData = { ...createProfileDto, username };
    return await this.profileService.createProfile(profileData, file);
  }

  @Get(':username')
  @HttpCode(200)
  async getProfile(
    @Headers('authorization') token: string,
    @Param('username') username: string,
  ) {
    this.validateToken(token, username);
    return await this.profileService.getProfile({ username });
  }

  @Patch(':username')
  @HttpCode(200)
  @UseInterceptors(FileInterceptor('file'))
  async updateProfile(
    @Headers('authorization') token: string,
    @Param('username') username: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    this.validateToken(token, username);
    return await this.profileService.updateProfile(
      updateProfileDto,
      username,
      file,
    );
  }
}
