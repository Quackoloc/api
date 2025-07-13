import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1752423026160 implements MigrationInterface {
    name = 'Migration1752423026160'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "colocation_task" DROP COLUMN "frequency"`);
        await queryRunner.query(`DROP TYPE "public"."colocation_task_frequency_enum"`);
        await queryRunner.query(`ALTER TABLE "colocation_task" ADD "frequency" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "colocation_task" DROP COLUMN "frequency"`);
        await queryRunner.query(`CREATE TYPE "public"."colocation_task_frequency_enum" AS ENUM('daily', 'weekly', 'monthly')`);
        await queryRunner.query(`ALTER TABLE "colocation_task" ADD "frequency" "public"."colocation_task_frequency_enum"`);
    }

}
