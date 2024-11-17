export enum Gender {
  Laki_Laki = 'Laki_Laki',
  Perempuan = 'Perempuan',
}

export class CreateProfileDto {
  age: number;
  gender: Gender;
  height: number;
  weight: number;
  username: string;
}

export class GetProfileDto {
  username: string;
}

export class UpdateProfileDto {
  age?: number;
  gender?: Gender;
  height?: number;
  weight?: number;
  bmi?: number;
  kcal?: number;
}
