// src/profile/profile.controller.ts

import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Headers,
  NotFoundException,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import {
  CreateProfileDto,
  GetProfileDto,
  UpdateProfileDto,
} from './profile.dto';

@Controller('api/profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  createProfile(@Body() createProfileDto: CreateProfileDto) {
    return this.profileService.createProfile(createProfileDto);
  }

  @Get('get')
  getProfile(@Body() getProfileDto: GetProfileDto) {
    try {
      return this.profileService.getProfile(getProfileDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { errors: 'Data tidak ditemukan' };
      }
      throw error;
    }
  }

  @Patch('current')
  updateProfile(
    @Headers('authorization') token: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const username = 'alifmuhammad'; // contoh hardcoded, ganti sesuai kebutuhan
    return this.profileService.updateProfile(updateProfileDto, username);
  }
}
