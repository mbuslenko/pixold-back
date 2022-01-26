import { MigrationInterface, QueryRunner } from 'typeorm';

export class addNotificationsEntity1643228165302 implements MigrationInterface {
  name = 'addNotificationsEntity1643228165302';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "notifications" (
          "id" uuid NOT NULL DEFAULT uuid_generate_v4(), 
          "created_at" TIMESTAMP NOT NULL DEFAULT now(), 
          "updated_at" TIMESTAMP NOT NULL DEFAULT now(), 
          "user_id" character varying NOT NULL, 
          "type" character varying NOT NULL, 
          "last_notified_at" TIMESTAMP NOT NULL, 
          CONSTRAINT "notification_type_user_id" UNIQUE ("type", "user_id"), 
          CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "notifications"`);
  }
}
