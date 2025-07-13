import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1752422124822 implements MigrationInterface {
    name = 'Migration1752422124822'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pending_user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, CONSTRAINT "UQ_df7ff5a4672a3479c641cd67191" UNIQUE ("email"), CONSTRAINT "UQ_df7ff5a4672a3479c641cd67191" UNIQUE ("email"), CONSTRAINT "PK_ea2c9c5daf7f8339c58f5325734" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ea2c9c5daf7f8339c58f532573" ON "pending_user" ("id") `);
        await queryRunner.query(`CREATE INDEX "IDX_df7ff5a4672a3479c641cd6719" ON "pending_user" ("email") `);
        await queryRunner.query(`CREATE TYPE "public"."colocation_task_frequency_enum" AS ENUM('daily', 'weekly', 'monthly')`);
        await queryRunner.query(`CREATE TABLE "colocation_task" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "dueDate" TIMESTAMP NOT NULL, "status" "public"."colocation_task_status_enum" NOT NULL DEFAULT 'todo', "priority" "public"."colocation_task_priority_enum" NOT NULL DEFAULT 'medium', "colocationId" integer NOT NULL, "assignedToId" integer NOT NULL, "frequency" "public"."colocation_task_frequency_enum", "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_a0056fb4bfd782b0600bc1011a3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a0056fb4bfd782b0600bc1011a" ON "colocation_task" ("id") `);
        await queryRunner.query(`CREATE TABLE "pending_user_colocations_colocation" ("pendingUserId" integer NOT NULL, "colocationId" integer NOT NULL, CONSTRAINT "PK_9a7d88ee8aa298819ee32a02df8" PRIMARY KEY ("pendingUserId", "colocationId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_378af6978f5e6fce16e4004add" ON "pending_user_colocations_colocation" ("pendingUserId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0d5205512f7e67a1b4293bac17" ON "pending_user_colocations_colocation" ("colocationId") `);
        await queryRunner.query(`ALTER TABLE "colocation_task" ADD CONSTRAINT "FK_3b0f8a86e7b48c0e25fb49517f2" FOREIGN KEY ("colocationId") REFERENCES "colocation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "colocation_task" ADD CONSTRAINT "FK_d973ee0b96d08391d55d4260b43" FOREIGN KEY ("assignedToId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pending_user_colocations_colocation" ADD CONSTRAINT "FK_378af6978f5e6fce16e4004add6" FOREIGN KEY ("pendingUserId") REFERENCES "pending_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "pending_user_colocations_colocation" ADD CONSTRAINT "FK_0d5205512f7e67a1b4293bac174" FOREIGN KEY ("colocationId") REFERENCES "colocation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pending_user_colocations_colocation" DROP CONSTRAINT "FK_0d5205512f7e67a1b4293bac174"`);
        await queryRunner.query(`ALTER TABLE "pending_user_colocations_colocation" DROP CONSTRAINT "FK_378af6978f5e6fce16e4004add6"`);
        await queryRunner.query(`ALTER TABLE "colocation_task" DROP CONSTRAINT "FK_d973ee0b96d08391d55d4260b43"`);
        await queryRunner.query(`ALTER TABLE "colocation_task" DROP CONSTRAINT "FK_3b0f8a86e7b48c0e25fb49517f2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0d5205512f7e67a1b4293bac17"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_378af6978f5e6fce16e4004add"`);
        await queryRunner.query(`DROP TABLE "pending_user_colocations_colocation"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a0056fb4bfd782b0600bc1011a"`);
        await queryRunner.query(`DROP TABLE "colocation_task"`);
        await queryRunner.query(`DROP TYPE "public"."colocation_task_frequency_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_df7ff5a4672a3479c641cd6719"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ea2c9c5daf7f8339c58f532573"`);
        await queryRunner.query(`DROP TABLE "pending_user"`);
    }

}
