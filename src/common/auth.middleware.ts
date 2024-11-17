import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from './prisma.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prismaService: PrismaService,
  ) {}

  async use(req: any, res: any, next: (error?: any) => void) {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header is missing');
    }

    const token = authHeader.split(' ')[1]; // Expecting 'Bearer <token>'
    if (!token) {
      throw new UnauthorizedException(
        'Token is missing from authorization header',
      );
    }

    try {
      // Verify and decode JWT
      const decoded = this.jwtService.verify(token);

      // Retrieve user from the database by username
      const user = await this.prismaService.user.findUnique({
        where: { username: decoded.username }, // Assuming JWT payload has 'username'
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Attach user information to request object
      req.user = user;
      next();
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
