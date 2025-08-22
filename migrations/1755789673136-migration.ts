import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1755789673136 implements MigrationInterface {
  name = 'Migration1755789673136';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_task_preference" ("id" SERIAL NOT NULL, "isOptedIn" boolean NOT NULL DEFAULT true, "userId" integer NOT NULL, "taskId" integer NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_aa6fc5700d3856ea4ef01db8f78" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "colocation" ALTER COLUMN "tasksRotationFrequency" SET DEFAULT '7'`
    );
    await queryRunner.query(
      `ALTER TABLE "user_task_preference" ADD CONSTRAINT "FK_2c09616e3f69a2b6faabe72d8bf" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user_task_preference" ADD CONSTRAINT "FK_8bc20e83bc02e060dcdead0781f" FOREIGN KEY ("taskId") REFERENCES "colocation_task"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_task_preference" DROP CONSTRAINT "FK_8bc20e83bc02e060dcdead0781f"`
    );
    await queryRunner.query(
      `ALTER TABLE "user_task_preference" DROP CONSTRAINT "FK_2c09616e3f69a2b6faabe72d8bf"`
    );
    await queryRunner.query(
      `ALTER TABLE "colocation" ALTER COLUMN "tasksRotationFrequency" SET DEFAULT '6'`
    );
    await queryRunner.query(`DROP TABLE "user_task_preference"`);
  }
}
