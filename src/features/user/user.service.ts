import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../../databases/entities/user.entity';
import { ILike, Repository } from 'typeorm';
import { CreateUserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update.user.dto';
import { IPaginationOptions, Pagination, paginate } from 'nestjs-typeorm-paginate';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Injectable()
export class UserService {
  private Logger = new Logger(UserService.name)
    constructor(
      @InjectRepository(UserEntity)
      private readonly userRepo: Repository<UserEntity>
    ){}

async paginate(options: IPaginationOptions, email?: string): Promise<Pagination<UserEntity>> {
    const queryBuilder = this.userRepo.createQueryBuilder('user')
    if(email){
      queryBuilder.where('LOWER(user.email) LIKE :email', { email: `%${email.toLowerCase()}%` })
    }

    const result = await paginate<UserEntity>(this.userRepo, options, {email});
    return result
}

  async findOnebyId (id: number): Promise<UserEntity>{
      const userData = await this.userRepo.findOneBy({ id });
      if (!userData) {
        throw new NotFoundException('User not found')
      }
      return userData
    }

    async findOneByEmail(email: string):Promise<UserEntity | null>{
      return await this.userRepo.findOne({
        where:{ email },
        select: ['id', 'email', 'password'],
      });
    }

  async createUser(createUserDto: CreateUserDto): Promise<UserEntity>{
    const newUser: UserEntity = await this.userRepo.create(createUserDto);
    return this.userRepo.save(newUser)
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto){
    const userUpdate = await this.userRepo.update(id, updateUserDto)
    if(!userUpdate){
      throw new BadRequestException('Theres missing somethiing')
    }
    return userUpdate
  }

  updateRefreshToken(userId: number, hashedToken: string){
    const existedRefresh = this.userRepo.update(userId, { refreshToken: hashedToken });
    return existedRefresh
  }

  async deleteUser(id: number){
    const user = await this.findOnebyId(id)
    return this.userRepo.remove(user)
  }
}
