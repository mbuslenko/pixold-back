import { MigrationInterface, QueryRunner } from 'typeorm';

export class addMierPixelsEntity1640681876921 implements MigrationInterface {
  name = 'addMierPixelsEntity1640681876921';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."miner_pixel_level_enum" AS ENUM('starter', 'middle', 'pro', 'supreme')`,
    );
    await queryRunner.query(
      `CREATE TABLE "miner_pixel" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
          "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
          "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
          "level" "public"."miner_pixel_level_enum" NOT NULL DEFAULT 'starter', 
          "coins_in_storage" real NOT NULL, 
          "is_attacked" boolean NOT NULL DEFAULT false, 
          "numeric_id" real NOT NULL, 
          CONSTRAINT "PK_07bb88e8f1574e905ee192c52f3" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "miner_pixel"`);
    await queryRunner.query(`DROP TYPE "public"."miner_pixel_level_enum"`);
  }
}
