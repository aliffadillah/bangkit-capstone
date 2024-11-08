import { HttpException, Inject, Injectable } from "@nestjs/common";
import { JwtService } from '@nestjs/jwt';  // Import JwtService
import { LoginUserRequest, RegisterUserRequest, UpdateUserRequest, UserResponse } from '../model/user.model';
import { ValidationService } from "../common/validation.service";
import { Logger } from "winston";
import { WINSTON_MODULE_PROVIDER } from "nest-winston";
import { PrismaService } from "../common/prisma.service";
import { UserValidation } from "./user.validation";
import * as bcrypt from "bcrypt";
import { User } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private jwtService: JwtService,  // Tambahkan JwtService untuk JWT
  ) {}

  // Register user
  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.debug(`Register new user ${JSON.stringify(request)}`);
    const registerRequest: RegisterUserRequest = this.validationService.validate(
      UserValidation.REGISTER,
      request
    );

    const totalUserWithUsername = await this.prismaService.user.count({
      where: {
        username: registerRequest.username,
      },
    });

    if (totalUserWithUsername != 0) {
      throw new HttpException('Username already exists', 400);
    }

    registerRequest.password = await bcrypt.hash(registerRequest.password, 10);
    const user = await this.prismaService.user.create({
      data: registerRequest,
    });

    return {
      username: user.username,
      name: user.name,
    };
  }

  // Login user (generate JWT token)
  async login(request: LoginUserRequest): Promise<{ username: string; name: string; token: string }> {
    this.logger.debug(`UserService.login(${JSON.stringify(request)})`);
    const loginRequest: LoginUserRequest = this.validationService.validate(
      UserValidation.LOGIN,
      request,
    );

    const user = await this.prismaService.user.findUnique({
      where: {
        username: loginRequest.username,
      },
    });

    if (!user || !(await bcrypt.compare(loginRequest.password, user.password))) {
      throw new HttpException('Username or password is invalid', 401);
    }

    // Generate JWT token
    const payload = { username: user.username };  // Define the payload for the JWT
    const token = this.jwtService.sign(payload);  // Sign the token with payload

    // Save the JWT token in the user's record in the database
    await this.prismaService.user.update({
      where: { username: user.username },
      data: { token },  // Store the generated JWT token in the token field
    });

    return {
      username: user.username,
      name: user.name,
      token: token,  // Return the JWT token in the response
    };
  }

  // Get current user data (using JWT token)
  async get(user: User): Promise<UserResponse> {
    return {
      username: user.username,
      name: user.name,
    };
  }

  // Update user data
  async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
    this.logger.debug(
      `UserService.update( ${JSON.stringify(user)} , ${JSON.stringify(request)}`,
    );

    const updateRequest: UpdateUserRequest = this.validationService.validate(
      UserValidation.UPDATE,
      request,
    );

    if (updateRequest.name) {
      user.name = updateRequest.name;
    }

    if (updateRequest.password) {
      user.password = await bcrypt.hash(updateRequest.password, 10);
    }

    const result = await this.prismaService.user.update({
      where: {
        username: user.username,
      },
      data: user,
    });

    return {
      name: result.name,
      username: result.username,
    };
  }

  // Logout (invalidate the token on client side, as JWT is stateless)
  async logout(user: User): Promise<UserResponse> {
    // JWT-based logout typically doesn't invalidate token on server side,
    // but you can implement token blacklist or just instruct client to delete token.
    // For now, just return the user data (client needs to delete token)
    return {
      username: user.username,
      name: user.name,
    };
  }
}
