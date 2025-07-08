import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetBalanceDefault1751197483478 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user_entity"
        ALTER COLUMN "balance" SET DEFAULT 0,
      ALTER
      COLUMN "balance" SET NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "user_entity"
        ALTER COLUMN "balance" DROP DEFAULT;
    `);
  }
}
