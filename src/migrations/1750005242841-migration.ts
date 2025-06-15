import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1750005242841 implements MigrationInterface {
    name = 'Migration1750005242841'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "password" character varying(100) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_entity" DROP COLUMN "password"`);
        await queryRunner.query(`ALTER TABLE "user_entity" ADD "password" character varying(30) NOT NULL`);
    }

}
