import { Module } from '@nestjs/common';
import { FeaturesModule } from './features/features.module';
import { DatabasesModule } from './databases/databases.module';

@Module({
    imports: [DatabasesModule, FeaturesModule],
})
export class AppModule {}
