import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';  // Import the schedule module
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_secret_key',
      signOptions: { expiresIn: '1h' },
    }),
    ScheduleModule.forRoot(),
    CommonModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
