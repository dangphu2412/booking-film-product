import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateInAppNotificationTable1763798961166
  implements MigrationInterface
{
  name = 'CreateInAppNotificationTable1763798961166';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "notification_in_app_notifications" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" uuid NOT NULL, "event_type" character varying(50) NOT NULL, "title" text NOT NULL, "body" text NOT NULL, "action_link" text, "metadata" jsonb, "is_read" boolean NOT NULL DEFAULT false, "read_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_724bf6c25a74ded2f82020eadcf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_user_unread" ON "notification_in_app_notifications" ("user_id") WHERE "is_read" = false`,
    );
    await queryRunner.query(
      `CREATE INDEX "idx_user_notifications" ON "notification_in_app_notifications" ("user_id", "created_at") `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."idx_user_notifications"`);
    await queryRunner.query(`DROP INDEX "public"."idx_user_unread"`);
    await queryRunner.query(`DROP TABLE "notification_in_app_notifications"`);
  }
}
