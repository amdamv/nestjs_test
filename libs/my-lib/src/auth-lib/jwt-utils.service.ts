import { BadRequestException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '@app/my-lib/auth-lib/interfaces/jwt-payload';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtUtilsService {
  logger = new Logger(JwtUtilsService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  verifyJwt(authHeader: string): { userId: string } {
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      throw new BadRequestException('Token not found');
    }
    try {
      const secret: string = this.configService.getOrThrow('JWT_SECRET');
      const payload: JwtPayload = this.jwtService.verify(token, { secret });
      return { userId: String(payload.id) };
    } catch (err) {
      this.logger.warn('JWT verification failed:', err);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
