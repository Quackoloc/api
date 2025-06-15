import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749921950867 implements MigrationInterface {
    name = 'Migration1749921950867'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."colocation_task_priority_enum" AS ENUM('low', 'medium', 'high')`);
        await queryRunner.query(`CREATE TABLE "colocation_task" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "dueDate" TIMESTAMP NOT NULL, "priority" "public"."colocation_task_priority_enum" NOT NULL DEFAULT 'medium', "colocationId" integer, "assignedToId" integer, CONSTRAINT "PK_a0056fb4bfd782b0600bc1011a3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a0056fb4bfd782b0600bc1011a" ON "colocation_task" ("id") `);
        await queryRunner.query(`ALTER TABLE "colocation_task" ADD CONSTRAINT "FK_3b0f8a86e7b48c0e25fb49517f2" FOREIGN KEY ("colocationId") REFERENCES "colocation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "colocation_task" ADD CONSTRAINT "FK_d973ee0b96d08391d55d4260b43" FOREIGN KEY ("assignedToId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "colocation_task" DROP CONSTRAINT "FK_d973ee0b96d08391d55d4260b43"`);
        await queryRunner.query(`ALTER TABLE "colocation_task" DROP CONSTRAINT "FK_3b0f8a86e7b48c0e25fb49517f2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a0056fb4bfd782b0600bc1011a"`);
        await queryRunner.query(`DROP TABLE "colocation_task"`);
        await queryRunner.query(`DROP TYPE "public"."colocation_task_priority_enum"`);
    }

}
