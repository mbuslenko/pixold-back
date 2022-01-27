import { MigrationInterface, QueryRunner } from 'typeorm';

export class changeLastNameToNullableInUserEntity1640371223841
  implements MigrationInterface
{
  name = 'changeLastNameToNullableInUserEntity1640371223841';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "last_name" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "last_name" SET NOT NULL`,
    );
  }
}
