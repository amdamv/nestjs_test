import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1750521957488 implements MigrationInterface {
  name = 'Migration1750521957488';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_entity"
      ADD "deletedAt" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "deletedAt"`);
  }
}
