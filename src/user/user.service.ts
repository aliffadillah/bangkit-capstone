import { HttpException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UpdateUserRequest,
  UserResponse,
} from '../model/user.model';
import { ValidationService } from '../common/validation.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { ZodError } from 'zod';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}
  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.debug(`Register new user ${JSON.stringify(request)}`);

    try {
      // Validate the registration request using Zod schema
      const registerRequest: RegisterUserRequest =
        this.validationService.validate(UserValidation.REGISTER, request);

      // Check if password and repeatPassword match
      if (registerRequest.password !== registerRequest.repeatPassword) {
        throw new HttpException('Passwords do not match', 400);
      }

      // Check if the username already exists
      const totalUserWithUsername = await this.prismaService.user.count({
        where: {
          username: registerRequest.username,
        },
      });

      if (totalUserWithUsername !== 0) {
        throw new HttpException('Username already exists', 400);
      }

      // Hash the password before saving
      registerRequest.password = await bcrypt.hash(
        registerRequest.password,
        10,
      );

      // Create the user in the database
      const user = await this.prismaService.user.create({
        data: {
          username: registerRequest.username,
          password: registerRequest.password,
          name: registerRequest.name,
          email: registerRequest.email,
        },
      });

      return {
        username: user.username,
        name: user.name,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        throw new HttpException(
          { message: 'Validation error', errors: error.errors },
          400,
        );
      }
      throw error;
    }
  }
  async login(
    request: LoginUserRequest,
  ): Promise<{ username: string; name: string; token: string }> {
    this.logger.debug(`UserService.login(${JSON.stringify(request)})`);

    try {
      // Validate the login request using Zod schema
      const loginRequest: LoginUserRequest = this.validationService.validate(
        UserValidation.LOGIN,
        request,
      );

      // Find the user by username
      const user = await this.prismaService.user.findUnique({
        where: {
          username: loginRequest.username,
        },
      });

      // Check if user exists and if password matches
      if (
        !user ||
        !(await bcrypt.compare(loginRequest.password, user.password))
      ) {
        throw new HttpException('Username or password is invalid', 401);
      }

      // Generate a JWT token
      const payload = { username: user.username };
      const token = this.jwtService.sign(payload);

      // Update the user's token in the database
      await this.prismaService.user.update({
        where: { username: user.username },
        data: { token },
      });

      return {
        username: user.username,
        name: user.name,
        token: token,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        throw new HttpException(
          { message: 'Validation error', errors: error.errors },
          400,
        );
      }
      throw error;
    }
  }
  async get(user: User): Promise<UserResponse> {
    return {
      username: user.username,
      name: user.name,
    };
  }
  async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
    this.logger.debug(
      `UserService.update(${JSON.stringify(user)}, ${JSON.stringify(request)})`,
    );

    try {
      // Validate the update request using Zod schema
      const updateRequest: UpdateUserRequest = this.validationService.validate(
        UserValidation.UPDATE,
        request,
      );

      // Prepare the update data
      const updateData: Partial<User> = {};

      if (updateRequest.name) {
        updateData.name = updateRequest.name;
      }

      if (updateRequest.password) {
        updateData.password = await bcrypt.hash(updateRequest.password, 10);
      }

      if (updateRequest.email) {
        updateData.email = updateRequest.email;
      }

      // Update the user data in the database
      const result = await this.prismaService.user.update({
        where: {
          username: user.username,
        },
        data: updateData,
      });

      return {
        username: result.username,
        name: result.name,
        email: result.email, // Include updated email
      };
    } catch (error) {
      if (error instanceof ZodError) {
        throw new HttpException(
          { message: 'Validation error', errors: error.errors },
          400,
        );
      }
      throw error;
    }
  }
  async logout(user: User): Promise<UserResponse> {
    this.logger.debug(`UserService.logout(${JSON.stringify(user)})`);

    // Remove the token from the user in the database
    await this.prismaService.user.update({
      where: { username: user.username },
      data: { token: null },
    });

    return {
      username: user.username,
      name: user.name,
    };
  }
}
