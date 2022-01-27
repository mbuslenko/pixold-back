import { MigrationInterface, QueryRunner } from 'typeorm';

export class addUniqueFieldToPixelEntity1641930069281
  implements MigrationInterface
{
  name = 'addUniqueFieldToPixelEntity1641930069281';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pixel" ADD CONSTRAINT "UQ_fbfa518bf1f93ea42921866a378" UNIQUE ("numeric_id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pixel" DROP CONSTRAINT "UQ_fbfa518bf1f93ea42921866a378"`,
    );
  }
}
