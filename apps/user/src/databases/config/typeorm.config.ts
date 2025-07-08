import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { UserEntity } from '@app/my-lib/database/entities/user.entity';

config();

export const getTypeormConfig = (configService: ConfigService): TypeOrmModuleOptions => ({
  type: 'postgres',
  host: configService.get('PG_HOST'),
  port: configService.get('PG_PORT') || 5432,
  username: configService.get('PG_USERNAME'),
  password: configService.get('PG_PASSWORD'),
  database: configService.get('PG_DATABASE'),
  entities: [UserEntity],
  migrations: ['dist/migrations/*.ts'],
  synchronize: false,
  autoLoadEntities: true,
});
