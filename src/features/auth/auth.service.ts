import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dto/user.dto';
import { UserEntity } from '../../databases/entities/user.entity';
import { TokenInterface } from './interface/token.interface';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async validateUser(email: string, password: string): Promise<UserEntity> {
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

  async login(userEntity: UserEntity): Promise<TokenInterface> {
    const tokens: TokenInterface = await this.tokenService.generateTokens(userEntity);
    await this.tokenService.saveRefreshToken(userEntity.id, tokens.refreshToken);
    return tokens;
  }

  async register(userDto: CreateUserDto): Promise<UserEntity> {
    const existUser = await this.userService.findOneByEmail(userDto.email);
    console.log(existUser);
    if (existUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(userDto.password, 10);
    const newUser = await this.userService.createUser({
      ...userDto,
      password: hashedPassword,
    });
    return newUser;
  }
}
