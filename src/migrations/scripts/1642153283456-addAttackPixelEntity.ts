import { MigrationInterface, QueryRunner } from 'typeorm';

export class addAttackPixelEntity1642153283456 implements MigrationInterface {
  name = 'addAttackPixelEntity1642153283456';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."attack_pixel_level_enum" AS ENUM('starter', 'middle', 'pro', 'supreme')`,
    );
    await queryRunner.query(
      `CREATE TABLE "attack_pixel" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
          "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
          "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
          "level" "public"."attack_pixel_level_enum" NOT NULL DEFAULT 'starter', 
          "is__attacking" boolean NOT NULL DEFAULT false, 
          "is_attacked" boolean NOT NULL DEFAULT false, 
          "numeric_id" real NOT NULL, 
          CONSTRAINT "PK_209e054e7b218205a7256253154" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "attack_pixel"`);
    await queryRunner.query(`DROP TYPE "public"."attack_pixel_level_enum"`);
  }
}
