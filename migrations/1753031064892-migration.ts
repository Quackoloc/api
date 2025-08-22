import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1753031064892 implements MigrationInterface {
  name = 'Migration1753031064892';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "invitation_code" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "expiresAt" TIMESTAMP WITH TIME ZONE NOT NULL, "colocationId" integer NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_fa9e818ade61aeee63f5d89baea" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fa9e818ade61aeee63f5d89bae" ON "invitation_code" ("id") `
    );
    await queryRunner.query(
      `CREATE TYPE "public"."colocation_task_status_enum" AS ENUM('todo', 'doing', 'done')`
    );
    await queryRunner.query(
      `CREATE TYPE "public"."colocation_task_priority_enum" AS ENUM('low', 'medium', 'high')`
    );
    await queryRunner.query(
      `CREATE TABLE "colocation_task" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "dueDate" TIMESTAMP WITH TIME ZONE, "isRecurrent" boolean NOT NULL DEFAULT false, "status" "public"."colocation_task_status_enum" NOT NULL DEFAULT 'todo', "priority" "public"."colocation_task_priority_enum" NOT NULL DEFAULT 'medium', "colocationId" integer NOT NULL, "assignedToId" integer NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_a0056fb4bfd782b0600bc1011a3" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a0056fb4bfd782b0600bc1011a" ON "colocation_task" ("id") `
    );
    await queryRunner.query(
      `ALTER TABLE "colocation" ADD "tasksRotationFrequency" integer NOT NULL DEFAULT '7'`
    );
    await queryRunner.query(
      `ALTER TABLE "colocation" ADD "nextRotationDate" TIMESTAMP WITH TIME ZONE NOT NULL`
    );
    await queryRunner.query(`ALTER TABLE "colocation" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "colocation" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`
    );
    await queryRunner.query(`ALTER TABLE "colocation" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "colocation" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`
    );
    await queryRunner.query(`ALTER TABLE "colocation" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "colocation" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`);
    await queryRunner.query(
      `// ALTER TABLE "invitation_code" ADD CONSTRAINT "FK_bd5900b974fcfabb08f0faaae49" FOREIGN KEY ("colocationId") REFERENCES "colocation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "colocation_task" ADD CONSTRAINT "FK_3b0f8a86e7b48c0e25fb49517f2" FOREIGN KEY ("colocationId") REFERENCES "colocation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "colocation_task" ADD CONSTRAINT "FK_d973ee0b96d08391d55d4260b43" FOREIGN KEY ("assignedToId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "colocation_task" DROP CONSTRAINT "FK_d973ee0b96d08391d55d4260b43"`
    );
    await queryRunner.query(
      `ALTER TABLE "colocation_task" DROP CONSTRAINT "FK_3b0f8a86e7b48c0e25fb49517f2"`
    );
    await queryRunner.query(
      `ALTER TABLE "invitation_code" DROP CONSTRAINT "FK_bd5900b974fcfabb08f0faaae49"`
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "deletedAt" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    await queryRunner.query(`ALTER TABLE "colocation" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "colocation" ADD "deletedAt" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "colocation" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "colocation" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(`ALTER TABLE "colocation" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "colocation" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`
    );
    await queryRunner.query(`ALTER TABLE "colocation" DROP COLUMN "nextRotationDate"`);
    await queryRunner.query(`ALTER TABLE "colocation" DROP COLUMN "tasksRotationFrequency"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_a0056fb4bfd782b0600bc1011a"`);
    await queryRunner.query(`DROP TABLE "colocation_task"`);
    await queryRunner.query(`DROP TYPE "public"."colocation_task_priority_enum"`);
    await queryRunner.query(`DROP TYPE "public"."colocation_task_status_enum"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_fa9e818ade61aeee63f5d89bae"`);
    await queryRunner.query(`DROP TABLE "invitation_code"`);
  }
}
