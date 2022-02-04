import { MigrationInterface, QueryRunner } from 'typeorm';

export class addUserToAttacksEntity1644014420095 implements MigrationInterface {
	name = 'addUserToAttacksEntity1644014420095';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "attacks" ADD "attacked_user_id" character varying NOT NULL DEFAULT 'deprecated_row'`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "attacks" DROP COLUMN "attacked_user_id"`,
		);
	}
}
