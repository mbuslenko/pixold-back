import { MigrationInterface, QueryRunner } from 'typeorm';

export class addAttacksEntity1643590574685 implements MigrationInterface {
	name = 'addAttacksEntity1643590574685';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE TABLE "attacks" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
                "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
                "attacked_x" real NOT NULL, 
                "attacked_y" real NOT NULL, 
                "attacker_x" real NOT NULL, 
                "attacker_y" real NOT NULL, 
                "finished" boolean NOT NULL, 
                CONSTRAINT "PK_04c8618b0c4d51627f625c55dad" PRIMARY KEY ("id"))`,
		);
		await queryRunner.query(
			`ALTER TABLE "attack_pixel" ADD "health" real NOT NULL DEFAULT '100'`,
		);
		await queryRunner.query(
			`ALTER TABLE "defender_pixel" ADD "health" real NOT NULL DEFAULT '100'`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "defender_pixel" DROP COLUMN "health"`,
		);
		await queryRunner.query(`ALTER TABLE "attack_pixel" DROP COLUMN "health"`);
		await queryRunner.query(`DROP TABLE "attacks"`);
	}
}
