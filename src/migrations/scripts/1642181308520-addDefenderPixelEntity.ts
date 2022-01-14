import { MigrationInterface, QueryRunner } from 'typeorm';

export class addDefenderPixelEntity1642181308520 implements MigrationInterface {
  name = 'addDefenderPixelEntity1642181308520';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."defender_pixel_level_enum" AS ENUM('starter', 'middle', 'pro', 'supreme')`,
    );
    await queryRunner.query(
      `CREATE TABLE "defender_pixel" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
          "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
          "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
          "level" "public"."defender_pixel_level_enum" NOT NULL DEFAULT 'starter', 
          "is_attacked" boolean NOT NULL DEFAULT false, 
          "numeric_id" real NOT NULL, 
          CONSTRAINT "PK_24c2ca8ee70025d553e061d8eb2" PRIMARY KEY ("id")
          )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "defender_pixel"`);
    await queryRunner.query(`DROP TYPE "public"."defender_pixel_level_enum"`);
  }
}
