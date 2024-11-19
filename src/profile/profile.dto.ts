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
  photo?: Express.Multer.File; // File object for upload
  photoUrl?: string; // URL of the uploaded file
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
  photo?: Express.Multer.File; // File object for upload
  photoUrl?: string; // URL of the uploaded file
}
