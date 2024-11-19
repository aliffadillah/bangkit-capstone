import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { GoogleCloudStorageService } from '../common/google-cloud-storage.service'; // Pastikan path sesuai dengan lokasi file

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, GoogleCloudStorageService], // Tambahkan GoogleCloudStorageService di sini
})
export class ProfileModule {}
