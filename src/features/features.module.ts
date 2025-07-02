import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { QueueModule } from './queue/queue.module';
import { FilesModule } from '../providers/files/files.module';

@Module({
  imports: [UserModule, AuthModule, QueueModule, FilesModule],
})
export class FeaturesModule {}
