import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBranchesTable1714300000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "branches" (
        "id" SERIAL PRIMARY KEY,
        "code" varchar(10),
        "name" varchar(255),
        "location" varchar(255),
        "country" varchar(255),
        "state" varchar(255),
        "city" varchar(255),
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now()
      )
    `);

    // Seed the EHCC branches
    await queryRunner.query(`
      INSERT INTO "branches" ("code", "name", "location", "country", "state", "city", "is_active") VALUES
        ('HQ', 'Enthronement Assembly Headquarters', 'Lagos Mainland, Nigeria', 'Nigeria', 'Lagos', 'Lagos Mainland', true),
        ('LK', 'Enthronement Assembly Lekki', 'Lagos Island, Nigeria', 'Nigeria', 'Lagos', 'Lekki', true),
        ('OS', 'Enthronement Assembly Oshogbo', 'Osun State, Nigeria', 'Nigeria', 'Osun', 'Oshogbo', true),
        ('OG', 'Enthronement Assembly Ogbomosho', 'Oyo State, Nigeria', 'Nigeria', 'Oyo', 'Ogbomosho', true),
        ('AB', 'Enthronement Assembly Abeokuta', 'Ogun State, Nigeria', 'Nigeria', 'Ogun', 'Abeokuta', true),
        ('UK', 'Enthronement Assembly UK', 'Manchester, United Kingdom', 'United Kingdom', 'England', 'Manchester', true),
        ('CA', 'Enthronement Assembly Canada', 'Canada', 'Canada', NULL, NULL, true),
        ('US', 'Enthronement Assembly USA', 'United States', 'United States', NULL, NULL, true)
      ON CONFLICT DO NOTHING
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS "branches"`);
  }
}
