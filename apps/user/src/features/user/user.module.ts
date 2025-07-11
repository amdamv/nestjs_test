import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FilesModule } from '../../databases/providers/files/files.module';
import { RedisModule } from '../../databases/redis/redis.module';
import { UserTransactionProvider } from './user-transaction.provider';
import { UserEntity } from '@app/my-lib/database/entities/user.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    FilesModule,
    RedisModule,
    TypeOrmModule,
    ClientsModule.registerAsync([
      {
        imports: [ConfigModule],
        inject: [ConfigService],
        name: 'NatsService',
        useFactory: (configService: ConfigService) => ({
          transport: Transport.NATS,
          options: {
            servers: configService.get<string>('NATS_SERVERS'),
          },
        }),
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, UserTransactionProvider],
  exports: [UserService],
})
export class UserModule {}
