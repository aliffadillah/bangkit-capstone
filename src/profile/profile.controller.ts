import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Query,
  Headers,
  UnauthorizedException,
  NotFoundException,
  UseInterceptors,
  UploadedFile,
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

  // Method to validate the token
  private validateToken(token: string, username: string) {
    if (!token) {
      throw new UnauthorizedException('Token tidak tersedia');
    }

    const decoded = this.jwtService.decode(token.replace('Bearer ', '')) as any;

    if (
      !decoded ||
      typeof decoded !== 'object' ||
      decoded.username !== username
    ) {
      throw new UnauthorizedException(
        'Token tidak valid atau pengguna tidak ditemukan',
      );
    }
  }

  // Method to create a profile
  @Post()
  @UseInterceptors(FileInterceptor('file')) // Interceptor to handle file uploads
  async createProfile(
    @Headers('authorization') token: string,
    @Query('username') username: string,
    @Body() createProfileDto: CreateProfileDto,
    @UploadedFile() file: Express.Multer.File, // Get the file uploaded by the user
  ) {
    // Validate the token
    this.validateToken(token, username);

    try {
      // Pass the profile data and file to the service
      const profileData = { ...createProfileDto, username };
      return await this.profileService.createProfile(profileData, file);
    } catch (error) {
      // Return a meaningful error message
      return { errors: 'Gagal membuat profil. Pastikan data sudah benar.' };
    }
  }

  // Method to get a profile
  @Get()
  async getProfile(
    @Headers('authorization') token: string,
    @Query('username') username: string,
  ) {
    // Validate the token
    this.validateToken(token, username);

    try {
      // Get profile data using the service
      return await this.profileService.getProfile({ username });
    } catch (error) {
      if (error instanceof NotFoundException) {
        return { errors: 'Data tidak ditemukan' };
      }
      throw error;
    }
  }

  // Method to update a profile
  @Patch()
  @UseInterceptors(FileInterceptor('file')) // Interceptor to handle file uploads
  async updateProfile(
    @Headers('authorization') token: string,
    @Query('username') username: string,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile() file: Express.Multer.File, // Get the file uploaded by the user
  ) {
    // Validate the token
    this.validateToken(token, username);

    try {
      // Pass updated profile data and file to the service
      return await this.profileService.updateProfile(
        updateProfileDto,
        username,
        file,
      );
    } catch (error) {
      // Return a meaningful error message
      return { errors: 'Gagal memperbarui profil' };
    }
  }
}
