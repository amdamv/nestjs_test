import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { UserEntity } from '../../databases/entities/user.entity';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { User } from './user-decorator/user.decorator';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { IUploadedMulterFile } from '../../providers/files/s3/interfaces/upload-file.interface';
import { CreateAvatarDto } from './dto/create-avatar.dto';
import { RemoveFilePayloadDto } from '../../providers/files/s3/dto/remove-file-payload.dto';
import { RedisService } from '../../databases/redis/redis.service';
import { TransactionDto } from './dto/transaction.dto';

@ApiTags('User')
@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post()
  @ApiBody({
    type: CreateUserDto,
    description: 'Json structure for user object',
  })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get()
  async findAllUser(@Query() query: PaginationQueryDto): Promise<Pagination<UserEntity>> {
    const { page, limit, email } = query;
    const options = { page, limit };
    return await this.userService.paginate(options, email);
  }

  @Get('me')
  async me(@User() user: UserEntity) {
    console.log(user);
    return this.userService.profile(user.id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    const key = `userId: ${id}`;
    const cached = await this.redisService.getObject<UserEntity>(key);
    console.log('cached user: ', cached);
    if (cached) {
      return cached;
    }
    const user = await this.userService.findOnebyId(id);
    await this.redisService.setObject(key, user, 60);
    console.log('Not Cached yet: ', user);
    return user;
  }

  @Patch(':id')
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() createUserDto: CreateUserDto) {
    return this.userService.updateUser(id, createUserDto);
  }

  @ApiOperation({ summary: 'body/form-data - key=file, value= choose-file' })
  @Post('avatar/upload-photo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@Body() dto: CreateAvatarDto, @UploadedFile() file: IUploadedMulterFile, @User('id') id: string) {
    console.log('Current user id:', id);
    return this.userService.createAvatar(dto, file, id);
  }

  @ApiOperation({ summary: 'body/form-data - key=file, value= choose-file' })
  @Delete('avatar/upload-photo')
  @UseInterceptors(FileInterceptor('file'))
  async deleteFile(@Body() dto: RemoveFilePayloadDto, @User() id: string) {
    return this.userService.deleteAvatar(dto, id);
  }

  @Delete(':id')
  removeUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.deleteUser(id);
  }

  @Post('transaction')
  async userTransaction(@Body() transactionDto: TransactionDto) {
    const { senderId, receiverId, amount } = transactionDto;
    return this.userService.transaferFunds(senderId, receiverId, amount);
  }
}
