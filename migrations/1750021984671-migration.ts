import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1750021984671 implements MigrationInterface {
    name = 'Migration1750021984671'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "colocation_task" RENAME COLUMN "completed" TO "status"`);
        await queryRunner.query(`ALTER TABLE "colocation_task" DROP COLUMN "status"`);
        await queryRunner.query(`CREATE TYPE "public"."colocation_task_status_enum" AS ENUM('todo', 'doing', 'done')`);
        await queryRunner.query(`ALTER TABLE "colocation_task" ADD "status" "public"."colocation_task_status_enum" NOT NULL DEFAULT 'todo'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "colocation_task" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."colocation_task_status_enum"`);
        await queryRunner.query(`ALTER TABLE "colocation_task" ADD "status" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "colocation_task" RENAME COLUMN "status" TO "completed"`);
    }

}
