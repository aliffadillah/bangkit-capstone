import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { CommonModule } from './common/common.module';
import { ProfileModule } from './profile/profile.module';
import { UserModule } from './user/user.module';
import { FoodsModule } from './foods/foods.module';
import { GoogleCloudStorageService } from './common/google-cloud-storage.service';
import { OcrModule } from './ocr/ocr.module';
import { AddFotoController } from './foods/add_foto.controller'; // Ensure the correct path for your controller
import { HttpModule } from '@nestjs/axios'; // Add HttpModule for HTTP requests

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Make environment variables available globally
      envFilePath: '.env', // Load environment variables from .env file
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_secret_key',
      signOptions: { expiresIn: '1h' },
    }),
    ScheduleModule.forRoot(), // For scheduled tasks (if used in your app)
    CommonModule,
    ProfileModule,
    UserModule,
    FoodsModule,
    OcrModule, // Ensure this module is imported if OCR-related functionality is needed
    HttpModule, // Ensure HttpModule is imported to make HTTP requests
  ],
  controllers: [
    AddFotoController, // Register AddFotoController to handle the /api/food/ocr route
    // Add any other controllers here
  ],
  providers: [GoogleCloudStorageService],
  exports: [GoogleCloudStorageService], // Exporting GoogleCloudStorageService if it is used in other modules
})
export class AppModule {}
