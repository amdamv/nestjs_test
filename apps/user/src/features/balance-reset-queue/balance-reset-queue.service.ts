import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { JobId, QueueJobName, QueueNames } from './constants/queue-names';

@Injectable()
export class BalanceResetQueueService {
  private logger = new Logger(BalanceResetQueueService.name);

  constructor(@InjectQueue(QueueNames.QUEUE_NAME_RESET) private myQueue: Queue) {}

  async monthlyReset() {
    const result = await this.myQueue.add(
      QueueJobName.MONTHLY_BALANCE_RESET,
      {},
      {
        repeat: { pattern: '0 0 1 * *' },
        removeOnComplete: true,
        jobId: JobId.JOB_ID,
      },
    );
    return result;
  }

  async removeMonthlyReset(): Promise<boolean> {
    const schedulers = await this.myQueue.getJobSchedulers();
    const target = schedulers.find((s) => s.name === QueueJobName.MONTHLY_BALANCE_RESET && s.pattern === '0 0 1 * *');
    if (!target) {
      this.logger.warn('Repeatable job not found');
      return false;
    }
    const deleted = await this.myQueue.removeJobScheduler(target.key); // Удаляем по key
    this.logger.log(`Removed job: ${target.key}`);
    return deleted;
  }
}
