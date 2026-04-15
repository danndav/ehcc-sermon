import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateCoreTables1713000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Ensure uuid extension
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    // Sermon enums
    await queryRunner.query(`CREATE TYPE "sermon_status_enum" AS ENUM ('draft', 'transcribed', 'published', 'scheduled', 'archived')`);
    await queryRunner.query(`CREATE TYPE "media_type_enum" AS ENUM ('video', 'audio')`);
    await queryRunner.query(`CREATE TYPE "programme_type_enum" AS ENUM ('sunday_service', 'midweek_service', '3dg', 'morning_by_morning', 'tod', 'special')`);
    await queryRunner.query(`CREATE TYPE "programme_session_enum" AS ENUM ('morning', 'evening')`);

    // Pastors
    await queryRunner.query(`
      CREATE TABLE "pastors" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" varchar(100) NOT NULL,
        "bio" text,
        "photo_url" varchar,
        "church_role" varchar,
        "branch_id" integer,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_pastors" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_pastors_branch_id" ON "pastors" ("branch_id")`);

    // Series
    await queryRunner.query(`
      CREATE TABLE "series" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" varchar(255) NOT NULL,
        "description" text,
        "thumbnail_url" varchar,
        "is_active" boolean NOT NULL DEFAULT true,
        "branch_id" integer,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_series" PRIMARY KEY ("id")
      )
    `);

    // Sermons
    await queryRunner.query(`
      CREATE TABLE "sermons" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "title" varchar(255) NOT NULL,
        "pastor_id" uuid,
        "series_id" uuid,
        "media_type" "media_type_enum" NOT NULL DEFAULT 'video',
        "video_url" varchar,
        "audio_url" varchar,
        "youtube_url" varchar,
        "thumbnail_url" varchar,
        "is_free" boolean NOT NULL DEFAULT true,
        "view_count" integer NOT NULL DEFAULT 0,
        "duration" integer,
        "status" "sermon_status_enum" NOT NULL DEFAULT 'draft',
        "programme_type" "programme_type_enum" NOT NULL DEFAULT 'sunday_service',
        "special_programme_name" varchar,
        "three_dg_day" integer,
        "programme_session" "programme_session_enum",
        "branch_id" integer,
        "published_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_sermons" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_sermons_status" ON "sermons" ("status")`);
    await queryRunner.query(`CREATE INDEX "IDX_sermons_branch_id" ON "sermons" ("branch_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_sermons_pastor_id" ON "sermons" ("pastor_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_sermons_series_id" ON "sermons" ("series_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_sermons_published_at" ON "sermons" ("published_at" DESC) WHERE "status" = 'published'`);

    // Sermon metadata
    await queryRunner.query(`
      CREATE TABLE "sermon_metadata" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "sermon_id" uuid NOT NULL UNIQUE,
        "summary" text,
        "tags" text,
        "transcript_text" text,
        "transcript_timestamps" jsonb,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_sermon_metadata" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_sermon_metadata_sermon_id" ON "sermon_metadata" ("sermon_id")`);

    // Watch history
    await queryRunner.query(`
      CREATE TABLE "watch_history" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "sermon_id" uuid NOT NULL,
        "progress_seconds" integer NOT NULL DEFAULT 0,
        "completed" boolean NOT NULL DEFAULT false,
        "last_watched_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_watch_history" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_watch_history_user_id" ON "watch_history" ("user_id")`);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_watch_history_user_sermon" ON "watch_history" ("user_id", "sermon_id") WHERE "deleted_at" IS NULL`);

    // Bookmarks
    await queryRunner.query(`
      CREATE TABLE "bookmarks" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "sermon_id" uuid NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_bookmarks" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_bookmarks_user_sermon" ON "bookmarks" ("user_id", "sermon_id") WHERE "deleted_at" IS NULL`);

    // User notes
    await queryRunner.query(`
      CREATE TABLE "user_notes" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "sermon_id" uuid NOT NULL,
        "transcript_timestamp" integer,
        "note_text" text NOT NULL,
        "highlighted_text" text,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_user_notes" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_user_notes_user_id" ON "user_notes" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_user_notes_sermon_id" ON "user_notes" ("sermon_id")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "user_notes"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "bookmarks"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "watch_history"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "sermon_metadata"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "sermons"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "series"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "pastors"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "programme_session_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "programme_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "media_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "sermon_status_enum"`);
  }
}
