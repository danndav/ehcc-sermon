import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateMinistryGuideTables1714100000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Leader-to-member assignments
    await queryRunner.query(`
      CREATE TABLE "ministry_assignments" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "leader_id" integer NOT NULL,
        "member_id" integer NOT NULL,
        "branch_id" integer,
        "notes" text,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_ministry_assignments" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_ministry_assignments_leader_member" ON "ministry_assignments" ("leader_id", "member_id") WHERE "deleted_at" IS NULL`);
    await queryRunner.query(`CREATE INDEX "IDX_ministry_assignments_leader_id" ON "ministry_assignments" ("leader_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_ministry_assignments_member_id" ON "ministry_assignments" ("member_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_ministry_assignments_branch_id" ON "ministry_assignments" ("branch_id")`);

    // Follow-up logs — leaders record when they reached out
    await queryRunner.query(`
      CREATE TABLE "ministry_followup_logs" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "assignment_id" uuid NOT NULL,
        "leader_id" integer NOT NULL,
        "member_id" integer NOT NULL,
        "comment" text NOT NULL,
        "reached_out_at" TIMESTAMP NOT NULL DEFAULT now(),
        "week_start" date NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_ministry_followup_logs" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_followup_logs_assignment_id" ON "ministry_followup_logs" ("assignment_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_followup_logs_leader_id" ON "ministry_followup_logs" ("leader_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_followup_logs_member_id" ON "ministry_followup_logs" ("member_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_followup_logs_week_start" ON "ministry_followup_logs" ("week_start")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "ministry_followup_logs"`);
    await queryRunner.query(`DROP TABLE IF EXISTS "ministry_assignments"`);
  }
}
