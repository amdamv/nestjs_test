import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '../../databases/entities/user.entity';
import { FilesModule } from '../../providers/files/files.module';
import { RedisModule } from '../../databases/redis/redis.module';
import { UserTransactionProvider } from './user-transaction.provider';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), FilesModule, RedisModule],
  controllers: [UserController],
  providers: [UserService, UserTransactionProvider],
  exports: [UserService],
})
export class UserModule {}
