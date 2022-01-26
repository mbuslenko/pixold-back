import {MigrationInterface, QueryRunner} from "typeorm";

export class addNotificationsEntity1643227729219 implements MigrationInterface {
    name = 'addNotificationsEntity1643227729219'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" character varying NOT NULL, "type" character varying NOT NULL, "last_notified_at" TIMESTAMP NOT NULL, CONSTRAINT "PK_6a72c3c0f683f6462415e653c3a" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "notifications"`);
    }

}
