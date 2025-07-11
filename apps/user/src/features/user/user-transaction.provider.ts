import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DataSource, QueryRunner } from 'typeorm';
import { TransactionResponseDto } from './dto/response/transaction-response.dto';
import { UserEntity } from '@app/my-lib/database/entities/user.entity';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class UserTransactionProvider {
  constructor(
    private readonly dataSource: DataSource,
    @Inject('NatsService') private natsClient: ClientProxy,
  ) {}

  async transferFunds(senderId: string, receiverId: string, amount: number): Promise<TransactionResponseDto> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this.senderTransaction(senderId, amount, queryRunner);
      await this.receiverTransaction(receiverId, amount, queryRunner);
      await queryRunner.commitTransaction();
      this.natsClient.emit('notificationTransaction', { senderId, receiverId, amount });
      return { senderId, receiverId, amount, message: 'Transaction completed successfully' };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(`transactions is declined:  ${err}`);
    } finally {
      await queryRunner.release();
    }
  }

  async senderTransaction(userId: string, amount: number, queryRunner: QueryRunner) {
    const result = await queryRunner.manager
      .createQueryBuilder()
      .update(UserEntity)
      .set({ balance: () => `"balance" - ${amount}` })
      .where('id = :id', { id: userId })
      .andWhere('balance >= :amount', { amount })
      .execute();

    if (result.affected === 0) {
      throw new NotFoundException(`Funds are insufficient or sender ${userId} not found`);
    }
  }

  async receiverTransaction(userId: string, amount: number, queryRunner: QueryRunner) {
    const result = await queryRunner.manager
      .createQueryBuilder()
      .update(UserEntity)
      .set({ balance: () => `"balance" + ${amount}` })
      .where('id = :id', { id: userId })
      .execute();
    console.log(result);
    if (result.affected === 0) {
      throw new NotFoundException(`Recipient ${userId} not found...`);
    }
  }
}
