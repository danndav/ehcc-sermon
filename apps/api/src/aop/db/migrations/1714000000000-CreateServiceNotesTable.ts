import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateServiceNotesTable1714000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "note_programme_type_enum" AS ENUM ('sunday_service', 'midweek_service', '3dg', 'special')
    `);
    await queryRunner.query(`
      CREATE TYPE "submission_type_enum" AS ENUM ('typed', 'upload')
    `);
    await queryRunner.query(`
      CREATE TABLE "service_notes" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" integer NOT NULL,
        "programme_type" "note_programme_type_enum" NOT NULL,
        "special_programme_name" varchar,
        "service_date" date NOT NULL,
        "submission_type" "submission_type_enum" NOT NULL,
        "typed_content" text,
        "file_url" varchar,
        "file_name" varchar,
        "file_type" varchar(100),
        "branch_id" integer,
        "deadline" TIMESTAMP NOT NULL,
        "is_late" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_service_notes" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_service_notes_user_date_programme" ON "service_notes" ("user_id", "service_date", "programme_type") WHERE "deleted_at" IS NULL`);
    await queryRunner.query(`CREATE INDEX "IDX_service_notes_user_id" ON "service_notes" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_service_notes_service_date" ON "service_notes" ("service_date")`);
    await queryRunner.query(`CREATE INDEX "IDX_service_notes_programme_type" ON "service_notes" ("programme_type")`);
    await queryRunner.query(`CREATE INDEX "IDX_service_notes_deadline" ON "service_notes" ("deadline")`);
    await queryRunner.query(`CREATE INDEX "IDX_service_notes_branch_id" ON "service_notes" ("branch_id")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "service_notes"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "submission_type_enum"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "note_programme_type_enum"`);
  }
}
