import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '@app/my-lib/auth-lib/interfaces/jwt-payload';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtUtilsService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  verifyJwt(authHeader: string): { userId: string } {
    const token = authHeader?.replace('Bearer ', '');
    console.log('Token received:', token);

    if (!token) {
      throw new BadRequestException('Token not found');
    }
    try {
      const secret: string = this.configService.getOrThrow('JWT_SECRET');
      console.log('JWT_SECRET used:', secret);

      const payload: JwtPayload = this.jwtService.verify(token, { secret });
      console.log('Decoded JWT payload:', payload);

      return { userId: String(payload.id) };
    } catch (err) {
      console.warn('JWT verification failed:', err);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
