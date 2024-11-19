// src/profile/profile.controller.ts

import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Query,
  Headers,
  UnauthorizedException,
  UploadedFile,
  UseInterceptors,
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

  @Post()
  @UseInterceptors(FileInterceptor('photo'))
  async createProfile(
    @Headers('authorization') token: string,
    @Query('username') username: string,
    @Body() createProfileDto: CreateProfileDto,
    @UploadedFile() file: Express.Multer.File, // Handle the uploaded file
  ) {
    if (!token) {
      throw new UnauthorizedException('Token tidak tersedia');
    }

    const decoded = this.jwtService.decode(token.replace('Bearer ', ''));
    if (
      !decoded ||
      typeof decoded !== 'object' ||
      decoded['username'] !== username
    ) {
      throw new UnauthorizedException(
        'Token tidak valid atau pengguna tidak ditemukan',
      );
    }

    try {
      const profileData = { ...createProfileDto, username };
      return await this.profileService.createProfile(profileData, file);
    } catch (error) {
      return { errors: 'Gagal membuat profil. Pastikan data sudah benar.' };
    }
  }

  @Patch()
  @UseInterceptors(FileInterceptor('photo')) // Handle file for updates
  async updateProfile(
    @Headers('authorization') token: string,
    @Query('username') username: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File, // Handle the uploaded file
  ) {
    if (!token) {
      throw new UnauthorizedException('Token tidak tersedia');
    }

    const decoded = this.jwtService.decode(token.replace('Bearer ', ''));
    if (
      !decoded ||
      typeof decoded !== 'object' ||
      decoded['username'] !== username
    ) {
      throw new UnauthorizedException(
        'Token tidak valid atau pengguna tidak ditemukan',
      );
    }

    try {
      return await this.profileService.updateProfile(
        updateProfileDto,
        username,
        file,
      );
    } catch (error) {
      return { errors: 'Gagal memperbarui profil' };
    }
  }
}
