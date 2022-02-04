import { MigrationInterface, QueryRunner } from 'typeorm';

export class addOpenseaUrlFieldToPixel1643935937107 implements MigrationInterface {
	name = 'addOpenseaUrlFieldToPixel1643935937107';

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`ALTER TABLE "pixel" ADD "opensea_url" character varying`,
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`ALTER TABLE "pixel" DROP COLUMN "opensea_url"`);
	}
}
