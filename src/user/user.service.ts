import { HttpException, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UpdateUserRequest,
  UserResponse,
  LogoutResponse,
} from '../model/user.model';
import { ValidationService } from '../common/validation.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
    private jwtService: JwtService,
  ) {}

  private throwError(
    message: string,
    statusCode: number,
    details: string[] = [],
  ): void {
    throw new HttpException(
      {
        statusCode,
        message,
        details,
      },
      statusCode,
    );
  }

  async register(request: RegisterUserRequest): Promise<{ username: string; name: string; token: string }> {
    this.logger.debug(`Register new user ${JSON.stringify(request)}`);

    try {
      const registerRequest = UserValidation.REGISTER.parse(
          request,
      ) as RegisterUserRequest;

      if (registerRequest.password !== registerRequest.repeatPassword) {
        this.throwError('Passwords do not match', 400, [
          'password',
          'repeatPassword',
        ]);
      }

      const totalUserWithUsername = await this.prismaService.user.count({
        where: {
          username: registerRequest.username,
        },
      });

      if (totalUserWithUsername !== 0) {
        this.throwError('Username already exists', 400, ['username']);
      }

      registerRequest.password = await bcrypt.hash(
          registerRequest.password,
          10,
      );

      const user = await this.prismaService.user.create({
        data: {
          username: registerRequest.username,
          password: registerRequest.password,
          name: registerRequest.name,
          email: registerRequest.email,
        },
      });

      const payload = { username: user.username };
      const token = this.jwtService.sign(payload);

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
        this.throwError(
            'Validation error',
            400,
            error.errors.map((e) => e.message),
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
      const loginRequest = UserValidation.LOGIN.parse(
        request,
      ) as LoginUserRequest;

      const user = await this.prismaService.user.findUnique({
        where: {
          username: loginRequest.username,
        },
      });

      if (
        !user ||
        !(await bcrypt.compare(loginRequest.password, user.password))
      ) {
        this.throwError('Username or password is invalid', 401, [
          'username',
          'password',
        ]);
      }

      const payload = { username: user.username };
      const token = this.jwtService.sign(payload);

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
        this.throwError(
          'Validation error',
          400,
          error.errors.map((e) => e.message),
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
      const updateRequest: UpdateUserRequest = this.validationService.validate(
        UserValidation.UPDATE,
        request,
      );

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

      if (Object.keys(updateData).length === 0) {
        this.throwError('No data to update', 400, [
          'name',
          'password',
          'email',
        ]);
      }

      const result = await this.prismaService.user.update({
        where: {
          username: user.username,
        },
        data: updateData,
      });

      return {
        username: result.username,
        name: result.name,
        email: result.email,
      };
    } catch (error) {
      if (error instanceof ZodError) {
        this.throwError(
          'Validation error',
          400,
          error.errors.map((e) => e.message),
        );
      }

      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          this.throwError('Email already in use', 400, ['email']);
        }
      }

      this.throwError('Error updating user', 500, ['update']);
    }
  }

  async logout(user: User): Promise<LogoutResponse> {
    this.logger.debug(`UserService.logout(${JSON.stringify(user)})`);

    try {
      await this.prismaService.user.update({
        where: { username: user.username },
        data: { token: null },
      });

      return {
        username: user.username,
        name: user.name,
        message: 'Successfully logged out',
      };
    } catch (error) {
      this.throwError('Error during logout', 500, ['logout']);
    }
  }
}
