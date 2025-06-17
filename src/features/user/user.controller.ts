import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/user.dto';
import { UserEntity } from '../../databases/entities/user.entity';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { Pagination } from 'nestjs-typeorm-paginate';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
@UseGuards(LocalAuthGuard)
  @Post()
   createUser(@Body() createUserDto: CreateUserDto){
    return this.userService.createUser(createUserDto)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAllUser(@Query() query: PaginationQueryDto): Promise<Pagination<UserEntity>>{
  const options = {page: query.page, limit: query.limit}
  return this.userService.paginate(options)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
   findOne(@Param('id', ParseIntPipe) id: number ): Promise<UserEntity>{
    return this.userService.findOnebyId(id)
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch(':id')
  updateUser(@Param('id', ParseIntPipe) id: number, createUserDto: CreateUserDto){
    return this.userService.updateUser(id, createUserDto)
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  removeUser(@Param('id', ParseIntPipe)id: number){
    return this.userService.deleteUser(id)
  }
}
