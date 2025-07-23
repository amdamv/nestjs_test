import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
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
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { Pagination } from 'nestjs-typeorm-paginate';
import { User } from '../decorator/user.decorator';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { IUploadedMulterFile } from '../../databases/providers/files/s3/interfaces/upload-file.interface';
import { CreateAvatarDto } from './dto/create-avatar.dto';
import { RemoveFilePayloadDto } from '../../databases/providers/files/s3/dto/remove-file-payload.dto';
import { RedisService } from '../../databases/redis/redis.service';
import { TransactionDto } from './dto/transaction.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserTransactionProvider } from './user-transaction.provider';
import { UpdateUserDto } from './dto/update.user.dto';
import { UserEntity } from '@app/my-lib/database/entities/user.entity';

@ApiTags('User')
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  logger = new Logger(UserController.name);

  constructor(
    private readonly userService: UserService,
    private readonly redisService: RedisService,
    private readonly userTransactionProvider: UserTransactionProvider,
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

  @Get('findAll')
  async findAll() {
    return this.userService.findAll();
  }

  @Get()
  async paginateAllUsers(@Query() query: PaginationQueryDto): Promise<Pagination<UserEntity>> {
    const { page, limit, email } = query;
    const options = { page, limit };
    return await this.userService.paginate(options, email);
  }

  @Get('me')
  async me(@User() user: UserEntity) {
    this.logger.log('user: ', user);
    return this.userService.profile(user.id);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<UserEntity> {
    const key = `userId: ${id}`;
    const cached = await this.redisService.getObject<UserEntity>(key);
    this.logger.log('cached user: ', cached);
    if (cached) {
      return cached;
    }
    const user = await this.userService.findOnebyId(id);
    await this.redisService.setObject(key, user, 60);
    this.logger.log('Not Cached yet: ', user);
    return user;
  }

  @Patch(':id')
  updateUser(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @ApiOperation({ summary: 'body/form-data - key=file, value= choose-file' })
  @Post('avatar/upload-photo')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@Body() dto: CreateAvatarDto, @UploadedFile() file: IUploadedMulterFile, @User('id') id: string) {
    this.logger.log('Current user id:', id);
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

  @UseGuards(JwtAuthGuard)
  @Post('transaction')
  async userTransaction(@User('id') id: string, @Body() transactionDto: TransactionDto) {
    const { receiverId, amount } = transactionDto;
    return this.userTransactionProvider.transferFunds(id, receiverId, amount);
  }
}
