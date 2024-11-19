import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { CommonModule } from './common/common.module';
import { ProfileModule } from './profile/profile.module';
import { UserModule } from './user/user.module';
import { FoodsModule } from './foods/foods.module';
import { GoogleCloudStorageService } from './common/google-cloud-storage.service'; // Import service GCS

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_secret_key',
      signOptions: { expiresIn: '1h' },
    }),
    ScheduleModule.forRoot(),
    CommonModule,
    ProfileModule,
    UserModule,
    FoodsModule,
  ],
  controllers: [],
  providers: [GoogleCloudStorageService], // Tambahkan GoogleCloudStorageService ke dalam providers
})
export class AppModule {}
