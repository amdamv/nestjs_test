import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { RedisModule } from './redis/redis.module';
import { getTypeormConfig } from './config/typeorm.config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: getTypeormConfig,
    }),
    RedisModule,
  ],
})
export class DatabasesModule {}