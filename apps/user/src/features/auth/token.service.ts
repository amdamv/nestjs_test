import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RedisService } from '../../databases/redis/redis.service';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TokenInterface } from './interface/token.interface';
import { JwtPayload } from '@app/my-lib/auth-lib/interfaces/jwt-payload';
import { UserEntity } from '@app/my-lib/database/entities/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class TokenService {
  logger = new Logger(TokenService.name);

  constructor(
    @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly redisService: RedisService,
  ) {}

  async generateTokens(user: LoginDto): Promise<TokenInterface> {
    const payload = { id: user.id, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_MS'),
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
    });

    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string): Promise<TokenInterface> {
    const payload = await this.verifyRefresh(refreshToken);
    const user = await this.validateUserAndToken(payload.id, refreshToken);

    const tokens = await this.generateTokens(user);
    await this.saveRefreshToken(user.id, tokens.refreshToken);
    return tokens;
  }

  async verifyRefresh(refreshToken: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verify(refreshToken, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      });
    } catch (err) {
      throw new UnauthorizedException('invalid payload', err);
    }
  }

  async validateUserAndToken(userId: number, refreshToken: string) {
    const [user] = await Promise.all([this.userService.findOnebyId(userId)]);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('invalid user');
    }
    const inValid: boolean = await bcrypt.compare(refreshToken, user.refreshToken);
    if (!inValid) {
      throw new UnauthorizedException('invalid refresh token');
    }
    return user;
  }

  async saveRefreshToken(userId: number, token: string) {
    const hashed: string = await bcrypt.hash(token, 10);
    await this.updateRefreshToken(userId, token);
    await this.redisService.set(`refresh:${userId}`, hashed);
  }

  updateRefreshToken(userId: number, hashedToken: string) {
    const existedRefresh = this.userRepo.update(userId, {
      refreshToken: hashedToken,
    });
    return existedRefresh;
  }

  async debugGetRefresh(userId: number) {
    const value = await this.redisService.get(`refresh:${userId}`);
    this.logger.log('stored in redis: ', value);
    return value;
  }
}
