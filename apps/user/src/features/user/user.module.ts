import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesModule } from '../../databases/providers/files/files.module';
import { RedisModule } from '../../databases/redis/redis.module';
import { UserTransactionProvider } from './user-transaction.provider';
import { UserEntity } from '@app/my-lib/database/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), FilesModule, RedisModule, TypeOrmModule],
  controllers: [UserController],
  providers: [UserService, UserTransactionProvider],
  exports: [UserService],
})
export class UserModule {}
