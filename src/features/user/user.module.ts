import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../databases/entities/user.entity';
import { FilesModule } from '../../providers/files/files.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), FilesModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
