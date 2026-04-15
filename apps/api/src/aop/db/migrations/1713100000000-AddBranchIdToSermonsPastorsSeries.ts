import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBranchIdToSermonsPastorsSeries1713100000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add branch_id to sermons if the table exists
    const sermonsExists = await queryRunner.hasTable('sermons');
    if (sermonsExists) {
      await queryRunner.query(`ALTER TABLE "sermons" ADD COLUMN IF NOT EXISTS "branch_id" integer`);
      await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_sermons_branch_id" ON "sermons" ("branch_id")`);
    }

    // Add branch_id to pastors if the table exists
    const pastorsExists = await queryRunner.hasTable('pastors');
    if (pastorsExists) {
      await queryRunner.query(`ALTER TABLE "pastors" ADD COLUMN IF NOT EXISTS "branch_id" integer`);
      await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_pastors_branch_id" ON "pastors" ("branch_id")`);
    }

    // Add branch_id to series if the table exists
    const seriesExists = await queryRunner.hasTable('series');
    if (seriesExists) {
      await queryRunner.query(`ALTER TABLE "series" ADD COLUMN IF NOT EXISTS "branch_id" integer`);
      await queryRunner.query(`CREATE INDEX IF NOT EXISTS "IDX_series_branch_id" ON "series" ("branch_id")`);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const sermonsExists = await queryRunner.hasTable('sermons');
    if (sermonsExists) {
      await queryRunner.query(`DROP INDEX IF EXISTS "IDX_sermons_branch_id"`);
      await queryRunner.query(`ALTER TABLE "sermons" DROP COLUMN IF EXISTS "branch_id"`);
    }

    const pastorsExists = await queryRunner.hasTable('pastors');
    if (pastorsExists) {
      await queryRunner.query(`DROP INDEX IF EXISTS "IDX_pastors_branch_id"`);
      await queryRunner.query(`ALTER TABLE "pastors" DROP COLUMN IF EXISTS "branch_id"`);
    }

    const seriesExists = await queryRunner.hasTable('series');
    if (seriesExists) {
      await queryRunner.query(`DROP INDEX IF EXISTS "IDX_series_branch_id"`);
      await queryRunner.query(`ALTER TABLE "series" DROP COLUMN IF EXISTS "branch_id"`);
    }
  }
}
