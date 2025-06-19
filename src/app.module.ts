import { Module } from '@nestjs/common';
import { FeaturesModule } from './features/features.module';
import { DatabasesModule } from './databases/databases.module';
import { ConfigModule } from '@nestjs/config';

@Module({
    imports: [
      ConfigModule.forRoot({isGlobal:true}),
      DatabasesModule,
      FeaturesModule,

    ],
})
export class AppModule {}
