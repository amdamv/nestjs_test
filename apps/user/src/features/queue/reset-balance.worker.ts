import { Processor, WorkerHost } from '@nestjs/bullmq';
import { UserService } from '../user/user.service';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { QueueNames } from './constants/queue-names';

@Processor(QueueNames.QUEUE_NAME_RESET)
export class ResetBalanceWorker extends WorkerHost {
  private logger = new Logger(ResetBalanceWorker.name);

  constructor(private readonly userService: UserService) {
    super();
  }

  async process(job: Job) {
    this.logger.log(`Running job: ${job.name}`);
    const users = await this.userService.findAll();

    for (const user of users) {
      user.balance = 0;
      await this.userService.updateUser(user.id, { balance: 0 });
    }
    this.logger.log('Reset balance was successfull');
  }
}
