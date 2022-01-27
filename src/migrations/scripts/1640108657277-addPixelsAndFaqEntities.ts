import { MigrationInterface, QueryRunner } from 'typeorm';

export class addPixelsAndFaqEntities1640108657277
  implements MigrationInterface
{
  name = 'addPixelsAndFaqEntities1640108657277';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      CREATE TABLE "faq_content" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
          "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
          "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
          "question" character varying NOT NULL, 
          "answer" character varying NOT NULL, 
          "topic_id" character varying NOT NULL, 
          CONSTRAINT "PK_444ccb6e8a165a927fa7bb8357a" PRIMARY KEY ("id")
          )
          `,
    );
    await queryRunner.query(
      `CREATE TABLE "faq_topics" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
          "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
          "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
          "name" character varying NOT NULL, 
          "description" character varying, 
          CONSTRAINT "PK_bfbf37e400d6a8354b5c261673a" PRIMARY KEY ("id")
          )
          `,
    );
    await queryRunner.query(
      `CREATE TABLE "pixel" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
          "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
          "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
          "numeric_id" real NOT NULL, 
          "type" character varying NOT NULL DEFAULT 'without', 
          "owner_id" character varying NOT NULL DEFAULT 'pixold', 
          "x_coordinate" real NOT NULL, 
          "y_coordinate" real NOT NULL, 
          CONSTRAINT "PK_e5500ed5568dd675dd36919528d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" (
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
          CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), 
          CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), 
          CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "pixel"`);
    await queryRunner.query(`DROP TABLE "faq_topics"`);
    await queryRunner.query(`DROP TABLE "faq_content"`);
  }
}
