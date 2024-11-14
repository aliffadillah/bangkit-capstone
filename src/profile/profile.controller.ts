import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Query,
  Headers,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { CreateProfileDto, UpdateProfileDto } from './profile.dto';
import { JwtService } from '@nestjs/jwt';

@Controller('api/profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  async createProfile(
    @Headers('authorization') token: string,
    @Query('username') username: string,
    @Body() createProfileDto: CreateProfileDto,
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
      // Add 'username' to the DTO before passing it to the service
      const profileData = { ...createProfileDto, username };
      return await this.profileService.createProfile(profileData);
    } catch (error) {
      return { errors: 'Gagal membuat profil. Pastikan data sudah benar.' };
    }
  }

  @Get()
  async getProfile(
    @Headers('authorization') token: string,
    @Query('username') username: string,
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
      // Passing only the 'username' query param to the service
      return await this.profileService.getProfile({ username });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { errors: 'Data tidak ditemukan' };
      }
      throw error;
    }
  }

  @Patch()
  async updateProfile(
    @Headers('authorization') token: string,
    @Query('username') username: string,
    @Body() updateProfileDto: UpdateProfileDto,
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
      );
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        return { errors: 'Token tidak valid atau pengguna tidak ditemukan' };
      } else if (error instanceof NotFoundException) {
        return { errors: 'Profil tidak ditemukan' };
      }
      return { errors: 'Gagal memperbarui profil' };
    }
  }
}
