// src/profile/profile.controller.ts

import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Headers,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import {
  CreateProfileDto,
  GetProfileDto,
  UpdateProfileDto,
} from './profile.dto';
import { JwtService } from '@nestjs/jwt'; // Add JwtService for token decoding

@Controller('api/profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly jwtService: JwtService, // Inject JwtService
  ) {}

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
    @Headers('authorization') token: string, // Get the token from headers
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    try {
      // Decode the JWT token to extract user information (e.g., username)
      const decoded = this.jwtService.decode(token.replace('Bearer ', ''));

      if (!decoded || !decoded['username']) {
        throw new UnauthorizedException('Invalid token or user not found');
      }

      const username = decoded['username']; // Extract username from decoded token
      return this.profileService.updateProfile(updateProfileDto, username);
    } catch (error) {
      throw new UnauthorizedException('Token decoding failed');
    }
  }
}
