import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { CreateUserDto } from '../user/dto/user.dto';
import { UserEntity } from '../../databases/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import * as process from 'node:process';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('User is not found. Please try again');
    }
    const isMatch: boolean = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Password is not valid');
    }
    return user;
  }

  async generateTokens(userEntity: UserEntity) {
    const payload = { id: userEntity.id, email: userEntity.email };
    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRATION_MS,
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
    });

    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshtoken: string) {
    try {
      const payload = this.jwtService.verify(refreshtoken, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      });

      const user = await this.userService.findOnebyId(payload.id);
      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('invalid user');
      }

      const inValid = bcrypt.compare(refreshtoken, user.refreshToken);
      if (!inValid) {
        throw new UnauthorizedException('invalid refresh token');
      }

      const tokens = await this.generateTokens(user);
      await this.saveRefreshToken(user.id, tokens.refreshToken);

      return tokens;
    } catch (err) {
      throw new UnauthorizedException('token expired or invalid');
    }
  }

  async saveRefreshToken(userId: number, token: string) {
    const hashed = await bcrypt.hash(token, 10);
    await this.userService.updateRefreshToken(userId, hashed);
  }

  async login(userEntity: UserEntity) {
    const tokens = await this.generateTokens(userEntity);
    await this.saveRefreshToken(userEntity.id, tokens.refreshToken);
    return tokens;
  }

  async register(
    userDto: CreateUserDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const existingUser = await this.userService.findOneByEmail(userDto.email);
    if (existingUser) {
      throw new BadRequestException('This email already in use');
    }
    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const newUser = await this.userService.createUser({
      ...userDto,
      password: hashedPassword,
    });

    const tokens = await this.generateTokens(newUser);
    await this.saveRefreshToken(newUser.id, tokens.refreshToken);
    return tokens;
  }
}
