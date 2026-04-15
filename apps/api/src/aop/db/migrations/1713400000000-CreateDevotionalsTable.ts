import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDevotionalsTable1713400000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "devotionals" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "sermon_id" uuid NOT NULL,
        "content_json" jsonb NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_devotionals" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`CREATE INDEX "IDX_devotionals_user_id" ON "devotionals" ("user_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_devotionals_sermon_id" ON "devotionals" ("sermon_id")`);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_devotionals_user_sermon" ON "devotionals" ("user_id", "sermon_id") WHERE "deleted_at" IS NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "devotionals"`);
  }
}
