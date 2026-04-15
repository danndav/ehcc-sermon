import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateVideoProjectsTable1713300000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "video_status_enum" AS ENUM ('uploaded', 'transcoding', 'ready', 'failed');
    `);

    await queryRunner.query(`
      CREATE TABLE "video_projects" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "sermon_id" uuid NOT NULL,
        "raw_r2_key" varchar,
        "hls_prefix" varchar,
        "thumbnail_key" varchar,
        "status" "video_status_enum" NOT NULL DEFAULT 'uploaded',
        "error_message" varchar,
        "duration_seconds" integer,
        "file_size_bytes" bigint,
        "raw_deleted" boolean NOT NULL DEFAULT false,
        "transcode_progress" jsonb,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_video_projects" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_video_projects_sermon_id" UNIQUE ("sermon_id")
      );
    `);

    await queryRunner.query(`CREATE INDEX "IDX_video_projects_sermon_id" ON "video_projects" ("sermon_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_video_projects_status" ON "video_projects" ("status")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "video_projects"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "video_status_enum"`);
  }
}
