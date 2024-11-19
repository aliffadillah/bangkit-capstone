import {
  Injectable,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import { GoogleCloudStorageService } from '../common/google-cloud-storage.service';
import {
  CreateProfileDto,
  GetProfileDto,
  UpdateProfileDto,
  Gender,
} from './profile.dto';

@Injectable()
export class ProfileService {
  constructor(
    private prisma: PrismaService,
    private googleCloudStorageService: GoogleCloudStorageService,
  ) {}

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
      throw new BadRequestException(
        'User dengan username tersebut tidak ditemukan',
      );
    }

    if (age <= 0 || weight <= 0 || height <= 0) {
      throw new BadRequestException(
        'Age, weight, and height must be positive values.',
      );
    }

    const bmi = this.calculateBMI(weight, height);
    const kcal = this.calculateKcal(age, gender);

    let photoUrl: string | undefined = undefined;
    if (file) {
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
      throw new InternalServerErrorException(
        'Gagal membuat profil. Silakan coba lagi.',
      );
    }
  }

  async getProfile(getProfileDto: GetProfileDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { username: getProfileDto.username },
    });

    if (!profile) {
      throw new NotFoundException('Data profil tidak ditemukan');
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
      throw new NotFoundException('Profil tidak ditemukan');
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

    if (updateProfileDto.weight && updateProfileDto.height) {
      if (updateProfileDto.weight <= 0 || updateProfileDto.height <= 0) {
        throw new BadRequestException(
          'Weight and height must be positive values.',
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
      throw new InternalServerErrorException(
        'Gagal memperbarui profil. Silakan coba lagi.',
      );
    }
  }
}
