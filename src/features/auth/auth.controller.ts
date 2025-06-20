import { Body, Controller, Get, Param, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { UserEntity } from '../../databases/entities/user.entity';
import { Response } from 'express';
import { Request } from 'express';
import { ConfigService } from '@nestjs/config';
import * as ms from 'ms'
import { TokenService } from './token.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly tokenService: TokenService
) {}

  @Post('refresh')
  async refresh(@Req() req: Request, @Res({passthrough: true})res: Response) {
    const  incomingToken = req.cookies['refresh_token']
    if (!incomingToken) {
      throw new UnauthorizedException('No refresh token')
    }
    const { accessToken, refreshToken} = await this.tokenService.refreshTokens(incomingToken)
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: ms(this.configService.get('REFRESH_TOKEN_EXPIRES_IN') || '7d')
    })
    return { access_token: accessToken }
}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@CurrentUser() userEntity: UserEntity, @Res({passthrough: true}) res: Response) {
    const { accessToken, refreshToken } = await this.authService.login(userEntity)
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: ms(this.configService.get('REFRESH_TOKEN_EXPIRES_IN') || '7d')
    })
    return { access_token: accessToken }
  }

  @Post('register')
  async register(@Body()dto: CreateUserDto, @Res({passthrough: true}) res: Response){
    const result = this.authService.register(dto)
    console.log(result);
    return result
  }

  @Get('debug/:userId')
  async getRefreshDebug(@Param('userId') id: number){
    return await this.tokenService.debugGetRefresh(id)
  }
}
