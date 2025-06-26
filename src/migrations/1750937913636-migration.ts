import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1750937913636 implements MigrationInterface {
  name = 'Migration1750937913636';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "avatar"`);
    await queryRunner.query(`ALTER TABLE "user_entity"
      ADD "avatar" character varying(512)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "avatar"`);
    await queryRunner.query(`ALTER TABLE "user_entity"
      ADD "avatar" character varying`);
  }
}
