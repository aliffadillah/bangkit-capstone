export class CreateProfileDto {
  age: number;
  gender: string;
  height: number;
  weight: number;
  username: string;
}

export class GetProfileDto {
  username: string;
}

export class UpdateProfileDto {
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  bmi?: number;
  kcal?: number;
}
