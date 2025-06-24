import { Module } from '@nestjs/common';
import { FeaturesModule } from './features/features.module';
import { DatabasesModule } from './databases/databases.module';
import { ConfigModule } from '@nestjs/config';
import { FilesModule } from './providers/files/files.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), DatabasesModule, FeaturesModule, FilesModule],
})
export class AppModule {}
