import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { UserEntity } from '@app/my-lib/database/entities/user.entity';

config();

export const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.PG_HOST || 'localhost',
  port: Number(process.env.PG_PORT) || 5432,
  username: process.env.PG_USERNAME || 'admin',
  password: process.env.PG_PASSWORD || 'admin123',
  database: process.env.PG_DATABASE || 'PgWithNest',
  entities: [UserEntity],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
});
