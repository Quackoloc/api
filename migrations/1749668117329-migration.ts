import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1749668117329 implements MigrationInterface {
    name = 'Migration1749668117329'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "invitation_code" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "expiresAt" TIMESTAMP NOT NULL, "colocationId" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_fa9e818ade61aeee63f5d89baea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_fa9e818ade61aeee63f5d89bae" ON "invitation_code" ("id") `);
        await queryRunner.query(`ALTER TABLE "invitation_code" ADD CONSTRAINT "FK_bd5900b974fcfabb08f0faaae49" FOREIGN KEY ("colocationId") REFERENCES "colocation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "invitation_code" DROP CONSTRAINT "FK_bd5900b974fcfabb08f0faaae49"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_fa9e818ade61aeee63f5d89bae"`);
        await queryRunner.query(`DROP TABLE "invitation_code"`);
    }

}
