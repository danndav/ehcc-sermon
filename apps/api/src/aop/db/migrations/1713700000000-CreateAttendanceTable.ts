import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAttendanceTable1713700000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "attendance" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" integer NOT NULL,
        "branch_id" integer,
        "latitude" decimal,
        "longitude" decimal,
        "clocked_in_at" TIMESTAMP NOT NULL DEFAULT now(),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_attendance" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE INDEX "IDX_attendance_user_id" ON "attendance" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_attendance_clocked_in_at" ON "attendance" ("clocked_in_at")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "attendance"`);
  }
}
