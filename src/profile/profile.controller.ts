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
import { JwtService } from '@nestjs/jwt';

@Controller('api/profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  async createProfile(@Body() createProfileDto: CreateProfileDto) {
    try {
      return await this.profileService.createProfile(createProfileDto);
    } catch (error) {
      return { errors: 'Gagal membuat profil. Pastikan data sudah benar.' };
    }
  }

  @Get('get')
  async getProfile(@Body() getProfileDto: GetProfileDto) {
    try {
      return await this.profileService.getProfile(getProfileDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { errors: 'Data tidak ditemukan' };
      }
      throw error;
    }
  }

  @Patch('current')
  async updateProfile(
    @Headers('authorization') token: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    if (!token) {
      throw new UnauthorizedException('Token tidak tersedia');
    }

    try {
      const decoded = this.jwtService.decode(token.replace('Bearer ', ''));

      if (!decoded || typeof decoded !== 'object' || !decoded['username']) {
        throw new UnauthorizedException('Token tidak valid atau pengguna tidak ditemukan');
      }

      const username = decoded['username'];
      return await this.profileService.updateProfile(updateProfileDto, username);
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
