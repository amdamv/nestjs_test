import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
      type: 'postgres',
      host: configService.get('PG_HOST'),
      port: parseInt(configService.get('PG_PORT') || '5432', 10),
      username: configService.get('PG_USERNAME'),
      password: configService.get('PG_PASSWORD'),
      entities: [UserEntity],
      database: configService.get('PG_DATABASE'),
      synchronize: false,
    })
    })
  ]
})
export class DatabasesModule {}