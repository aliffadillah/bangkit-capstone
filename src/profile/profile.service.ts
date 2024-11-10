// src/profile/profile.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateProfileDto,
  GetProfileDto,
  UpdateProfileDto,
} from './profile.dto';

@Injectable()
export class ProfileService {
  private profiles = [];

  calculateBMI(weight: number, height: number): number {
    const bmi = weight / (height / 100) ** 2;
    return parseFloat(bmi.toFixed(2)); // Rounded to 2 decimal places
  }

  calculateKcal(age: number, gender: string): number {
    const kcal = gender === 'Laki-Laki' ? 1600 + age * 2 : 1500 + age * 1.8;
    return parseFloat(kcal.toFixed(2)); // Rounded to 2 decimal places
  }

  createProfile(createProfileDto: CreateProfileDto) {
    const { age, gender, height, weight, username } = createProfileDto;
    const bmi = this.calculateBMI(Number(weight), height);
    const kcal = this.calculateKcal(age, gender);

    const profile = { ...createProfileDto, bmi, kcal };
    this.profiles.push(profile);

    return { data: profile };
  }

  getProfile(getProfileDto: GetProfileDto) {
    const profile = this.profiles.find(
      (p) => p.username === getProfileDto.username,
    );

    if (!profile) {
      throw new NotFoundException('Data tidak ditemukan');
    }

    return { data: profile };
  }

  updateProfile(updateProfileDto: UpdateProfileDto, username: string) {
    const profile = this.profiles.find((p) => p.username === username);

    if (!profile) {
      throw new NotFoundException('Data tidak ditemukan');
    }

    Object.assign(profile, updateProfileDto);

    if (profile.weight && profile.height) {
      profile.bmi = this.calculateBMI(Number(profile.weight), profile.height);
      profile.kcal = this.calculateKcal(profile.age, profile.gender);
    }

    return { data: profile };
  }
}
