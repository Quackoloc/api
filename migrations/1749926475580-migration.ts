import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749926475580 implements MigrationInterface {
    name = 'Migration1749926475580'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "colocation_task" ADD "completed" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "colocation_task" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "colocation_task" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "colocation_task" ADD "deletedAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "colocation_task" DROP CONSTRAINT "FK_3b0f8a86e7b48c0e25fb49517f2"`);
        await queryRunner.query(`ALTER TABLE "colocation_task" DROP CONSTRAINT "FK_d973ee0b96d08391d55d4260b43"`);
        await queryRunner.query(`ALTER TABLE "colocation_task" ALTER COLUMN "colocationId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "colocation_task" ALTER COLUMN "assignedToId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "colocation_task" ADD CONSTRAINT "FK_3b0f8a86e7b48c0e25fb49517f2" FOREIGN KEY ("colocationId") REFERENCES "colocation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "colocation_task" ADD CONSTRAINT "FK_d973ee0b96d08391d55d4260b43" FOREIGN KEY ("assignedToId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "colocation_task" DROP CONSTRAINT "FK_d973ee0b96d08391d55d4260b43"`);
        await queryRunner.query(`ALTER TABLE "colocation_task" DROP CONSTRAINT "FK_3b0f8a86e7b48c0e25fb49517f2"`);
        await queryRunner.query(`ALTER TABLE "colocation_task" ALTER COLUMN "assignedToId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "colocation_task" ALTER COLUMN "colocationId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "colocation_task" ADD CONSTRAINT "FK_d973ee0b96d08391d55d4260b43" FOREIGN KEY ("assignedToId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "colocation_task" ADD CONSTRAINT "FK_3b0f8a86e7b48c0e25fb49517f2" FOREIGN KEY ("colocationId") REFERENCES "colocation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "colocation_task" DROP COLUMN "deletedAt"`);
        await queryRunner.query(`ALTER TABLE "colocation_task" DROP COLUMN "updatedAt"`);
        await queryRunner.query(`ALTER TABLE "colocation_task" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "colocation_task" DROP COLUMN "completed"`);
    }

}
