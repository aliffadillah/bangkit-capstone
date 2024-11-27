import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { GoogleCloudStorageService } from '../common/google-cloud-storage.service';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, GoogleCloudStorageService],
})
export class ProfileModule {}
