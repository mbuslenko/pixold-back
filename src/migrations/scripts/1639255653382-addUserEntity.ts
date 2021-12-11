import { MigrationInterface, QueryRunner } from 'typeorm';

export class addUserEntity1639255653382 implements MigrationInterface {
  name = 'addUserEntity1639255653382';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_entity" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
          "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
          "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
          "username" character varying NOT NULL, 
          "first_name" character varying NOT NULL, 
          "last_name" character varying NOT NULL, 
          "email" character varying NOT NULL, 
          "last_logined_at" TIMESTAMP NOT NULL, 
          "avatar_url" character varying NOT NULL, 
          "access_token" character varying NOT NULL, 
          CONSTRAINT "UQ_9b998bada7cff93fcb953b0c37e" UNIQUE ("username"), 
          CONSTRAINT "UQ_415c35b9b3b6fe45a3b065030f5" UNIQUE ("email"), 
          CONSTRAINT "PK_b54f8ea623b17094db7667d8206" PRIMARY KEY ("id")
          )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user_entity"`);
  }
}
