import { BadRequestException, HttpException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/user.dto';
import { UpdateUserDto } from './dto/update.user.dto';

@Injectable()
export class UserService {
  private Logger = new Logger("UserService")
    constructor(
      @InjectRepository(UserEntity)
      private readonly userRepo: Repository<UserEntity>
    ){}

   public findAll (): Promise<UserEntity[]>{
      return this.userRepo.find();
  }

  async findOnebyId (id: number): Promise<UserEntity>{
      const userData = await this.userRepo.findOneBy({ id });
      if (!userData) {
        throw new HttpException('User not found', 404)
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

  }

  async deleteUser(id: number){
    const user = await this.findOnebyId(id)
    return this.userRepo.remove(user)
  }
}
