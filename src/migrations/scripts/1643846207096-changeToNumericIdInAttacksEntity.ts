import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeToNumericIdInAttacksEntity1643846207096 implements MigrationInterface {
	name = 'changeToNumericIdInAttacksEntity1643846207096';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "attacks" DROP COLUMN "attacked_x"`);
		await queryRunner.query(`ALTER TABLE "attacks" DROP COLUMN "attacked_y"`);
		await queryRunner.query(`ALTER TABLE "attacks" DROP COLUMN "attacker_x"`);
		await queryRunner.query(`ALTER TABLE "attacks" DROP COLUMN "attacker_y"`);
		await queryRunner.query(
			`ALTER TABLE "attacks" ADD "attacked_id" real NOT NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE "attacks" ADD "attacker_id" real NOT NULL`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "attacks" DROP COLUMN "attacker_id"`);
		await queryRunner.query(`ALTER TABLE "attacks" DROP COLUMN "attacked_id"`);
		await queryRunner.query(
			`ALTER TABLE "attacks" ADD "attacker_y" real NOT NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE "attacks" ADD "attacker_x" real NOT NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE "attacks" ADD "attacked_y" real NOT NULL`,
		);
		await queryRunner.query(
			`ALTER TABLE "attacks" ADD "attacked_x" real NOT NULL`,
		);
	}
}
