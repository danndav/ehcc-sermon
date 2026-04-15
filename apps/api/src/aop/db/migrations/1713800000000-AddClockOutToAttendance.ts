import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddClockOutToAttendance1713800000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "attendance" ADD COLUMN IF NOT EXISTS "clocked_out_at" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "attendance" DROP COLUMN IF EXISTS "clocked_out_at"`);
  }
}
