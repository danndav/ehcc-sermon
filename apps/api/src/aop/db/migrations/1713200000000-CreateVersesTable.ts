import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateVersesTable1713200000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE "verse_type_enum" AS ENUM ('week', 'year');
    `);

    await queryRunner.query(`
      CREATE TABLE "verses" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "type" "verse_type_enum" NOT NULL,
        "scripture" text NOT NULL,
        "reference" varchar(100) NOT NULL,
        "translation" varchar(50),
        "branch_id" integer,
        "start_date" date NOT NULL,
        "end_date" date,
        "is_active" boolean NOT NULL DEFAULT true,
        "set_by" varchar(255),
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        CONSTRAINT "PK_verses" PRIMARY KEY ("id")
      );
    `);

    await queryRunner.query(`CREATE INDEX "IDX_verses_type_active" ON "verses" ("type", "is_active")`);
    await queryRunner.query(`CREATE INDEX "IDX_verses_branch_id" ON "verses" ("branch_id")`);
    await queryRunner.query(`CREATE INDEX "IDX_verses_start_date" ON "verses" ("start_date")`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "verses"`);
    await queryRunner.query(`DROP TYPE IF EXISTS "verse_type_enum"`);
  }
}
