import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMinistryWeeklyReportsTable1714200000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "ministry_weekly_reports" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "leader_id" integer NOT NULL,
        "week_start" date NOT NULL,
        "report" text NOT NULL,
        "challenges" text,
        "prayer_points" text,
        "branch_id" integer,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_ministry_weekly_reports" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_ministry_weekly_reports_leader_week" ON "ministry_weekly_reports" ("leader_id", "week_start") WHERE "deleted_at" IS NULL`);
    await queryRunner.query(`CREATE INDEX "IDX_ministry_weekly_reports_leader_id" ON "ministry_weekly_reports" ("leader_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_ministry_weekly_reports_week_start" ON "ministry_weekly_reports" ("week_start")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "ministry_weekly_reports"`);
  }
}
