import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { TokenCleanupService } from '../common/tokencleanup.service';
import { PrismaService } from '../common/prisma.service';

@Module({
  providers: [UserService, PrismaService, TokenCleanupService],
  controllers: [UserController],
})
export class UserModule {

}