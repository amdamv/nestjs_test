import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { Module } from '@nestjs/common';
import { BalanceResetQueueModule } from './balance-reset-queue/balance-reset-queue.module';
import { FilesModule } from '../databases/providers/files/files.module';

@Module({
  imports: [UserModule, AuthModule, BalanceResetQueueModule, FilesModule],
})
export class FeaturesModule {}
