import { Body, Controller, Get, Param, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { Request, Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { TokenService } from './token.service';
import { ApiTags } from '@nestjs/swagger';
import { UserEntity } from '@app/my-lib/database/entities/user.entity';
import * as ms from 'ms';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const incomingToken: string | undefined = (req.cookies as Record<string, string> | undefined)?.['refresh_token'];
    if (!incomingToken) {
      throw new UnauthorizedException('No refresh token');
    }
    const { accessToken, refreshToken } = await this.tokenService.refreshTokens(incomingToken);
    const maxAge = ms(this.configService.get('REFRESH_TOKEN_EXPIRES_IN'));
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge,
    });
    return { access_token: accessToken };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@CurrentUser() userEntity: UserEntity, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(userEntity);
    const maxAge = ms(this.configService.get('REFRESH_TOKEN_EXPIRES_IN') || '7d');
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge,
    });
    return { access_token: accessToken };
  }

  @Post('register')
  async register(@Body() dto: CreateUserDto) {
    const result = this.authService.register(dto);
    console.log(result);
    return result;
  }

  @Get('debug/:userId')
  async getRefreshDebug(@Param('userId') id: number) {
    return await this.tokenService.debugGetRefresh(id);
  }
}
