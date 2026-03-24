import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLessonManagementFields1761208200000 implements MigrationInterface {
  name = 'AddLessonManagementFields1761208200000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "lesson" ADD "estimatedMinutes" integer NOT NULL DEFAULT 10`,
    );
    await queryRunner.query(
      `ALTER TABLE "lesson" ADD "published" boolean NOT NULL DEFAULT true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "published"`);
    await queryRunner.query(`ALTER TABLE "lesson" DROP COLUMN "estimatedMinutes"`);
  }
}
