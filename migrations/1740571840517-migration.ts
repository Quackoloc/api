import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1740571840517 implements MigrationInterface {
    name = 'Migration1740571840517'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pending_user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, CONSTRAINT "UQ_df7ff5a4672a3479c641cd67191" UNIQUE ("email"), CONSTRAINT "UQ_df7ff5a4672a3479c641cd67191" UNIQUE ("email"), CONSTRAINT "PK_ea2c9c5daf7f8339c58f5325734" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ea2c9c5daf7f8339c58f532573" ON "pending_user" ("id") `);
        await queryRunner.query(`CREATE INDEX "IDX_df7ff5a4672a3479c641cd6719" ON "pending_user" ("email") `);
        await queryRunner.query(`CREATE TABLE "colocation" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "backgroundImage" character varying NOT NULL, "address" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_e628d3686c0b7ef5c480bf89e7c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e628d3686c0b7ef5c480bf89e7" ON "colocation" ("id") `);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "avatar" character varying NOT NULL, "lastname" character varying NOT NULL, "firstname" character varying NOT NULL, "password" character varying NOT NULL, "colocationId" integer, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cace4a159ff9f2512dd4237376" ON "user" ("id") `);
        await queryRunner.query(`CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
        await queryRunner.query(`CREATE TABLE "pending_user_colocations_colocation" ("pendingUserId" integer NOT NULL, "colocationId" integer NOT NULL, CONSTRAINT "PK_9a7d88ee8aa298819ee32a02df8" PRIMARY KEY ("pendingUserId", "colocationId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_378af6978f5e6fce16e4004add" ON "pending_user_colocations_colocation" ("pendingUserId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0d5205512f7e67a1b4293bac17" ON "pending_user_colocations_colocation" ("colocationId") `);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_a98e72db554a8a04b6c200685e8" FOREIGN KEY ("colocationId") REFERENCES "colocation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pending_user_colocations_colocation" ADD CONSTRAINT "FK_378af6978f5e6fce16e4004add6" FOREIGN KEY ("pendingUserId") REFERENCES "pending_user"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "pending_user_colocations_colocation" ADD CONSTRAINT "FK_0d5205512f7e67a1b4293bac174" FOREIGN KEY ("colocationId") REFERENCES "colocation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pending_user_colocations_colocation" DROP CONSTRAINT "FK_0d5205512f7e67a1b4293bac174"`);
        await queryRunner.query(`ALTER TABLE "pending_user_colocations_colocation" DROP CONSTRAINT "FK_378af6978f5e6fce16e4004add6"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_a98e72db554a8a04b6c200685e8"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0d5205512f7e67a1b4293bac17"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_378af6978f5e6fce16e4004add"`);
        await queryRunner.query(`DROP TABLE "pending_user_colocations_colocation"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cace4a159ff9f2512dd4237376"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e628d3686c0b7ef5c480bf89e7"`);
        await queryRunner.query(`DROP TABLE "colocation"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_df7ff5a4672a3479c641cd6719"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ea2c9c5daf7f8339c58f532573"`);
        await queryRunner.query(`DROP TABLE "pending_user"`);
    }

}
