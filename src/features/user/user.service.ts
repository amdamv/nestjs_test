import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../databases/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { IPaginationOptions, paginate, Pagination } from 'nestjs-typeorm-paginate';
import { CreateAvatarDto } from './dto/create-avatar.dto';
import { IUploadedMulterFile } from '../../providers/files/s3/interfaces/upload-file.interface';
import { IFileService } from 'src/providers/files/files.adapter';

@Injectable()
export class UserService {
  private Logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    private readonly fileService: IFileService,
  ) {}

  async paginate(options: IPaginationOptions, email?: string): Promise<Pagination<UserEntity>> {
    const queryBuilder = this.userRepo.createQueryBuilder('user');
    if (email) {
      queryBuilder.where('LOWER(user.email) LIKE :email', {
        email: `%${email.toLowerCase()}%`,
      });
    }
    const result = await paginate<UserEntity>(this.userRepo, options, {
      email,
    });
    return result;
  }

  async profile(id: number) {
    return await this.userRepo.findOneBy({ id });
  }

  async findOnebyId(id: number): Promise<UserEntity> {
    const userData = await this.userRepo.findOneBy({ id });
    if (!userData) {
      throw new NotFoundException('User not found');
    }
    return userData;
  }

  async findOneByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepo.findOne({
      where: { email },
      select: ['id', 'email', 'password'],
    });
  }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity> {
    const newUser: UserEntity = this.userRepo.create(createUserDto);
    return await this.userRepo.save(newUser);
  }

  async createAvatar(dto: CreateAvatarDto, file: IUploadedMulterFile, id: string) {
    const { path } = await this.fileService.uploadFile({ file, folder: dto.folder, name: dto.name });
    console.log('user id:', id);
    await this.userRepo.update(id, { avatar: path });
    return { path };
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto) {
    const userUpdate = await this.userRepo.update(id, updateUserDto);
    if (!userUpdate) {
      throw new BadRequestException('Theres missing something');
    }
    return userUpdate;
  }

  updateRefreshToken(userId: number, hashedToken: string) {
    const existedRefresh = this.userRepo.update(userId, {
      refreshToken: hashedToken,
    });
    return existedRefresh;
  }

  async deleteUser(id: number) {
    const user = await this.findOnebyId(id);
    return this.userRepo.softRemove(user);
  }
}
