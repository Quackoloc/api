import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1737134779885 implements MigrationInterface {
    name = 'Migration1737134779885'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pending_user" DROP CONSTRAINT "FK_4d9794488c90dd7844f19011193"`);
        await queryRunner.query(`CREATE TABLE "pending_user_colocations_colocation" ("pendingUserId" integer NOT NULL, "colocationId" integer NOT NULL, CONSTRAINT "PK_9a7d88ee8aa298819ee32a02df8" PRIMARY KEY ("pendingUserId", "colocationId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_378af6978f5e6fce16e4004add" ON "pending_user_colocations_colocation" ("pendingUserId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0d5205512f7e67a1b4293bac17" ON "pending_user_colocations_colocation" ("colocationId") `);
        await queryRunner.query(`ALTER TABLE "pending_user" DROP COLUMN "colocationId"`);
        await queryRunner.query(`ALTER TABLE "pending_user_colocations_colocation" ADD CONSTRAINT "FK_378af6978f5e6fce16e4004add6" FOREIGN KEY ("pendingUserId") REFERENCES "pending_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "pending_user_colocations_colocation" ADD CONSTRAINT "FK_0d5205512f7e67a1b4293bac174" FOREIGN KEY ("colocationId") REFERENCES "colocation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pending_user_colocations_colocation" DROP CONSTRAINT "FK_0d5205512f7e67a1b4293bac174"`);
        await queryRunner.query(`ALTER TABLE "pending_user_colocations_colocation" DROP CONSTRAINT "FK_378af6978f5e6fce16e4004add6"`);
        await queryRunner.query(`ALTER TABLE "pending_user" ADD "colocationId" integer`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0d5205512f7e67a1b4293bac17"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_378af6978f5e6fce16e4004add"`);
        await queryRunner.query(`DROP TABLE "pending_user_colocations_colocation"`);
        await queryRunner.query(`ALTER TABLE "pending_user" ADD CONSTRAINT "FK_4d9794488c90dd7844f19011193" FOREIGN KEY ("colocationId") REFERENCES "colocation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
