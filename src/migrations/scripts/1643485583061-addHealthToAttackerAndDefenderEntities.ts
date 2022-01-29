import {MigrationInterface, QueryRunner} from "typeorm";

export class addHealthToAttackerAndDefenderEntities1643485583061 implements MigrationInterface {
    name = 'addHealthToAttackerAndDefenderEntities1643485583061'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attack_pixel" ADD "health" real NOT NULL DEFAULT '100'`);
        await queryRunner.query(`ALTER TABLE "defender_pixel" ADD "health" real NOT NULL DEFAULT '100'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "defender_pixel" DROP COLUMN "health"`);
        await queryRunner.query(`ALTER TABLE "attack_pixel" DROP COLUMN "health"`);
    }

}
