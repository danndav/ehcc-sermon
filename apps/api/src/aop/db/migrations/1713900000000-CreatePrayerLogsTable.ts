import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePrayerLogsTable1713900000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "prayer_logs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" integer NOT NULL,
        "start_time" varchar(10) NOT NULL,
        "end_time" varchar(10) NOT NULL,
        "duration_minutes" integer NOT NULL,
        "logged_date" date NOT NULL DEFAULT CURRENT_DATE,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_prayer_logs" PRIMARY KEY ("id")
      );
    `);
    await queryRunner.query(`CREATE INDEX "IDX_prayer_logs_user_id" ON "prayer_logs" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_prayer_logs_logged_date" ON "prayer_logs" ("logged_date")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "prayer_logs"`);
  }
}
