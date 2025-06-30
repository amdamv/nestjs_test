import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1751198276423 implements MigrationInterface {
  name = 'Migration1751198276423';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_entity"
      ALTER COLUMN "balance" SET NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_entity"
      ALTER COLUMN "balance" DROP NOT NULL`);
  }
}
