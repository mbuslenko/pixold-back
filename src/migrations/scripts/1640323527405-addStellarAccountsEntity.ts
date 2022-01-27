import { MigrationInterface, QueryRunner } from 'typeorm';

export class addStellarAccountsEntity1640323527405
  implements MigrationInterface
{
  name = 'addStellarAccountsEntity1640323527405';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "stellar_accounts" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
          "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
          "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
          "public_key" character varying NOT NULL, 
          "secret_key" character varying NOT NULL, 
          "sequence" real NOT NULL, 
          "balance_in_usd" real NOT NULL, 
          "balance_in_xlm" real NOT NULL, 
          "owner_id" uuid NOT NULL, 
          CONSTRAINT "UQ_d2381f322c14d649fa80b906e57" UNIQUE ("public_key"), 
          CONSTRAINT "PK_83c7f3b964fafc55c9d1f3b415c" PRIMARY KEY ("id")
          )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "stellar_accounts"`);
  }
}
