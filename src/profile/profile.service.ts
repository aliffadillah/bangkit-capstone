import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../common/prisma.service';
import {
  CreateProfileDto,
  GetProfileDto,
  UpdateProfileDto,
  Gender,
} from './profile.dto';

@Injectable()
export class ProfileService {
  constructor(private prisma: PrismaService) {}

  calculateBMI(weight: number, height: number): number {
    const bmi = weight / (height / 100) ** 2;
    return parseFloat(bmi.toFixed(2));
  }

  calculateKcal(age: number, gender: Gender): number {
    const kcal = gender === Gender.Laki_Laki ? 1600 + age * 2 : 1500 + age * 1.8;
    return parseFloat(kcal.toFixed(2));
  }

  async createProfile(createProfileDto: CreateProfileDto) {
    const { age, gender, height, weight, username } = createProfileDto;

    const user = await this.prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      throw new BadRequestException(
        'User dengan username tersebut tidak ditemukan',
      );
    }

    const bmi = this.calculateBMI(Number(weight), height);
    const kcal = this.calculateKcal(age, gender);

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
      },
    });

    return { data: profile };
  }

  async getProfile(getProfileDto: GetProfileDto) {
    const profile = await this.prisma.profile.findUnique({
      where: { username: getProfileDto.username },
    });

    if (!profile) {
      throw new NotFoundException('Data tidak ditemukan');
    }

    return { data: profile };
  }

  async updateProfile(updateProfileDto: UpdateProfileDto, username: string) {
    const profile = await this.prisma.profile.findUnique({
      where: { username },
    });

    if (!profile) {
      throw new NotFoundException('Data tidak ditemukan');
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
      updatedProfileData.bmi = this.calculateBMI(
        updatedProfileData.weight,
        updatedProfileData.height,
      );
      updatedProfileData.kcal = this.calculateKcal(
        updateProfileDto.age ?? profile.age,
        updateProfileDto.gender ?? profile.gender as Gender,
      );
    }

    const updatedProfile = await this.prisma.profile.update({
      where: { username },
      data: updatedProfileData,
    });

    return { data: updatedProfile };
  }
}
