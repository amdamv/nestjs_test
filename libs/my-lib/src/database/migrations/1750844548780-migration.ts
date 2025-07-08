import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1750844548780 implements MigrationInterface {
  name = 'Migration1750844548780';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_entity"
      ADD "avatar" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "avatar"`);
  }
}
