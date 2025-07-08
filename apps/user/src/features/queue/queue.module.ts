import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { QueueService } from './queue.service';
import { ResetBalanceWorker } from './reset-balance.worker';
import { QueueController } from './queue.controller';
import { UserModule } from '../user/user.module';
import { QueueNames } from './constants/queue-names';

@Module({
  imports: [
    BullModule.registerQueue({
      name: QueueNames.QUEUE_NAME_RESET,
    }),
    UserModule,
  ],
  controllers: [QueueController],
  providers: [QueueService, ResetBalanceWorker],
  exports: [QueueService],
})
export class QueueModule {}
