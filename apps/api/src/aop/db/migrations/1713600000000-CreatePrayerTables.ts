import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreatePrayerTables1713600000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Prayer category enum
    await queryRunner.query(
      `CREATE TYPE "prayer_category_enum" AS ENUM ('healing', 'finances', 'family', 'breakthrough', 'thanksgiving', 'salvation')`,
    );

    // Prayer requests
    await queryRunner.query(`
      CREATE TABLE "prayer_requests" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "content" text NOT NULL,
        "category" "prayer_category_enum" NOT NULL DEFAULT 'healing',
        "is_public" boolean NOT NULL DEFAULT true,
        "prayer_count" integer NOT NULL DEFAULT 0,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_prayer_requests" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_prayer_requests_user_id" ON "prayer_requests" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_prayer_requests_category" ON "prayer_requests" ("category")`);
    await queryRunner.query(`CREATE INDEX "IDX_prayer_requests_is_public" ON "prayer_requests" ("is_public") WHERE "deleted_at" IS NULL`);

    // Prayer agreements
    await queryRunner.query(`
      CREATE TABLE "prayer_agreements" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "prayer_request_id" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_prayer_agreements" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_prayer_agreements_user_request" ON "prayer_agreements" ("user_id", "prayer_request_id") WHERE "deleted_at" IS NULL`,
    );

    // Prayer recordings
    await queryRunner.query(`
      CREATE TABLE "prayer_recordings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" varchar(255) NOT NULL,
        "led_by" varchar,
        "video_url" varchar,
        "audio_url" varchar,
        "duration" integer,
        "transcript" text,
        "recorded_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_prayer_recordings" PRIMARY KEY ("id")
      )
    `);

    // Prayer settings (single-row config table)
    await queryRunner.query(`
      CREATE TABLE "prayer_settings" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "teams_link" varchar,
        "meeting_time" varchar NOT NULL DEFAULT '00:00',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_prayer_settings" PRIMARY KEY ("id")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "prayer_settings"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "prayer_recordings"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "prayer_agreements"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "prayer_requests"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "prayer_category_enum"`);
  }
}
