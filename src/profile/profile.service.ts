import { Injectable, HttpException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { GoogleCloudStorageService } from '../common/google-cloud-storage.service';
import {
  CreateProfileDto,
  GetProfileDto,
  UpdateProfileDto,
  Gender,
} from './profile.dto';
import * as mime from 'mime-types';

@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService,
    private googleCloudStorageService: GoogleCloudStorageService,
  ) {}

  throwError(
    message: string,
    statusCode: number,
    details: string[] = [],
  ): void {
    throw new HttpException(
      {
        statusCode,
        message,
        details,
      },
      statusCode,
    );
  }

  validateFile(file: Express.Multer.File): void {
    const allowedMimeTypes = ['image/jpeg', 'image/png'];
    const maxFileSize = 1 * 1024 * 1024;

    const fileMimeType = mime.lookup(file.originalname);

    if (!allowedMimeTypes.includes(fileMimeType)) {
      this.throwError('File harus berupa gambar JPG atau PNG.', 400, ['file']);
    }

    if (file.size > maxFileSize) {
      this.throwError('File tidak boleh lebih besar dari 1MB.', 400, ['file']);
    }
  }

  calculateBMI(weight: number, height: number): number {
    const bmi = weight / (height / 100) ** 2;
    return parseFloat(bmi.toFixed(2));
  }

  calculateKcal(age: number, gender: Gender): number {
    const kcal =
      gender === Gender.Laki_Laki ? 1600 + age * 2 : 1500 + age * 1.8;
    return parseFloat(kcal.toFixed(2));
  }

  async createProfile(
    createProfileDto: CreateProfileDto,
    file?: Express.Multer.File,
  ) {
    const { age, gender, height, weight, username } = createProfileDto;

    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      this.throwError('User dengan username tersebut tidak ditemukan', 400, [
        'username',
      ]);
    }

    const existingProfile = await this.prisma.profile.findUnique({
      where: { username },
    });

    if (existingProfile) {
      this.throwError(
        'Tidak bisa melakukan POST, karena data sudah tersedia',
        400,
        ['profile'],
      );
    }

    if (age <= 0 || weight <= 0 || height <= 0) {
      this.throwError('Age, weight, and height must be positive values.', 400, [
        'age',
        'weight',
        'height',
      ]);
    }

    const bmi = this.calculateBMI(weight, height);
    const kcal = this.calculateKcal(age, gender);

    let photoUrl: string =
      'https://storage.googleapis.com/db-cpastone/default-image/default';
    if (file) {
      this.validateFile(file); // Validate the file
      photoUrl = await this.googleCloudStorageService.uploadFile(file);
    }

    try {
      const profile = await this.prisma.profile.create({
        data: {
          age,
          gender,
          height,
          weight,
          bmi,
          kcal,
          username: user.username,
          name: user.name,
          email: user.email,
          photoUrl,
        },
      });
      return { data: profile };
    } catch (error) {
      this.throwError('Gagal membuat profil. Silakan coba lagi.', 500, [
        'createProfile',
      ]);
    }
  }

  async getProfile(getProfileDto: GetProfileDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { username: getProfileDto.username },
    });

    if (!profile) {
      this.throwError('Data profil tidak ditemukan', 404, ['username']);
    }

    return { data: profile };
  }

  async updateProfile(
    updateProfileDto: UpdateProfileDto,
    username: string,
    file?: Express.Multer.File,
  ) {
    const profile = await this.prisma.profile.findUnique({
      where: { username },
    });

    if (!profile) {
      this.throwError('Profil tidak ditemukan', 404, ['username']);
    }

    const updatedProfileData: Partial<UpdateProfileDto> = {
      ...updateProfileDto,
      height: updateProfileDto.height
        ? parseInt(updateProfileDto.height as any)
        : profile.height,
      weight: updateProfileDto.weight
        ? parseInt(updateProfileDto.weight as any)
        : profile.weight,
    };

    if (
      updateProfileDto.weight ||
      updateProfileDto.height ||
      updatedProfileData.age
    ) {
      if (
        updateProfileDto.weight <= 0 ||
        updateProfileDto.height <= 0 ||
        updateProfileDto.age <= 0
      ) {
        this.throwError(
          'Age, weight, dan height harus memiliki nilai positif.',
          400,
          ['age', 'weight', 'height'],
        );
      }
      updatedProfileData.bmi = this.calculateBMI(
        updatedProfileData.weight,
        updatedProfileData.height,
      );
      updatedProfileData.kcal = this.calculateKcal(
        updateProfileDto.age ?? profile.age,
        updateProfileDto.gender ?? (profile.gender as Gender),
      );
    }

    if (file) {
      this.validateFile(file); // Validate the file
      updatedProfileData.photoUrl =
        await this.googleCloudStorageService.uploadFile(file);
    }

    try {
      const updatedProfile = await this.prisma.profile.update({
        where: { username },
        data: updatedProfileData,
      });
      return { data: updatedProfile };
    } catch (error) {
      this.throwError('Gagal memperbarui profil. Silakan coba lagi.', 500, [
        'updateProfile',
      ]);
    }
  }
}
