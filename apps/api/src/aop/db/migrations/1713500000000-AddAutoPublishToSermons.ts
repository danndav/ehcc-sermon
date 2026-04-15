import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAutoPublishToSermons1713500000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sermons" ADD COLUMN IF NOT EXISTS "auto_publish" boolean NOT NULL DEFAULT false`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "sermons" DROP COLUMN IF EXISTS "auto_publish"`);
  }
}
