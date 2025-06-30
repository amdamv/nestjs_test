import { Injectable, NotFoundException } from '@nestjs/common';
import { UserEntity } from '../../databases/entities/user.entity';
import { QueryRunner } from 'typeorm';

@Injectable()
export class UserTransactionProvider {
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
