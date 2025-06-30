import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserEntity } from '../../databases/entities/user.entity';
import { TokenInterface } from './interface/token.interface';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { RedisService } from '../../databases/redis/redis.service';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interface/jwt-payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly redisService: RedisService,
  ) {}

  async generateTokens(userEntity: UserEntity): Promise<TokenInterface> {
    const payload = { id: userEntity.id, email: userEntity.email };
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
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
    const inValid = await bcrypt.compare(refreshToken, user.refreshToken);
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
    console.log('stored in redis: ', value);
    return value;
  }
}
