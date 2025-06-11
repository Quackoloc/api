import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749669544875 implements MigrationInterface {
    name = 'Migration1749669544875'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitation_code" DROP CONSTRAINT "FK_bd5900b974fcfabb08f0faaae49"`);
        await queryRunner.query(`ALTER TABLE "invitation_code" ALTER COLUMN "colocationId" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invitation_code" ADD CONSTRAINT "FK_bd5900b974fcfabb08f0faaae49" FOREIGN KEY ("colocationId") REFERENCES "colocation"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitation_code" DROP CONSTRAINT "FK_bd5900b974fcfabb08f0faaae49"`);
        await queryRunner.query(`ALTER TABLE "invitation_code" ALTER COLUMN "colocationId" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "invitation_code" ADD CONSTRAINT "FK_bd5900b974fcfabb08f0faaae49" FOREIGN KEY ("colocationId") REFERENCES "colocation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
