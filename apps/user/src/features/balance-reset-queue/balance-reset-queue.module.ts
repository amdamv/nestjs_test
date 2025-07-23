import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { BalanceResetQueueService } from './balance-reset-queue.service';
import { ResetBalanceWorker } from './reset-balance.worker';
import { BalanceResetQueueController } from './balance-reset-queue.controller';
import { UserModule } from '../user/user.module';
import { QueueNames } from './constants/queue-names';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueNames.QUEUE_NAME_RESET,
    }),
    UserModule,
  ],
  controllers: [BalanceResetQueueController],
  providers: [BalanceResetQueueService, ResetBalanceWorker],
  exports: [BalanceResetQueueService],
})
export class BalanceResetQueueModule {}
