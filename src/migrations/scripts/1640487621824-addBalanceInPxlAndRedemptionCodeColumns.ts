import { MigrationInterface, QueryRunner } from 'typeorm';

export class addBalanceInPxlAndRedemptionCodeColumns1640487621824 implements MigrationInterface {
  name = 'addBalanceInPxlAndRedemptionCodeColumns1640487621824';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pixel" ADD "redemption_code" character varying NOT NULL DEFAULT ''`,
    );
    await queryRunner.query(
      `ALTER TABLE "stellar_accounts" ADD "balance_in_pxl" real NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "stellar_accounts" ALTER COLUMN "balance_in_usd" SET DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "stellar_accounts" ALTER COLUMN "balance_in_xlm" SET DEFAULT '0'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "stellar_accounts" ALTER COLUMN "balance_in_xlm" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "stellar_accounts" ALTER COLUMN "balance_in_usd" DROP DEFAULT`,
    );
    await queryRunner.query(
      `ALTER TABLE "stellar_accounts" DROP COLUMN "balance_in_pxl"`,
    );
    await queryRunner.query(
      `ALTER TABLE "pixel" DROP COLUMN "redemption_code"`,
    );
  }
}
