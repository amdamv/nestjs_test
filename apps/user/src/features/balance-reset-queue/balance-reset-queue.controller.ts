import { BalanceResetQueueService } from './balance-reset-queue.service';
import { Controller, Delete, Get } from '@nestjs/common';

@Controller('reset')
export class BalanceResetQueueController {
  constructor(private readonly queueService: BalanceResetQueueService) {}

  @Get('monthly-reset-balace')
  async resetBalance() {
    return this.queueService.monthlyReset();
  }

  @Delete('remove-reset-balance')
  async removeResetBalance(): Promise<{ success: boolean; message: string }> {
    const result = await this.queueService.removeMonthlyReset();
    return result
      ? { success: true, message: `Repeatable job removed` }
      : { success: false, message: `Repeatable job not found` };
  }
}
