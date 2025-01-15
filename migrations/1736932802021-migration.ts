import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1736932802021 implements MigrationInterface {
    name = 'Migration1736932802021'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "colocation" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "address" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "PK_e628d3686c0b7ef5c480bf89e7c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_e628d3686c0b7ef5c480bf89e7" ON "colocation" ("id") `);
        await queryRunner.query(`CREATE TABLE "user_colocation" ("id" SERIAL NOT NULL, "role" character varying NOT NULL, "userId" integer, "colocationId" integer, CONSTRAINT "PK_a846d21965f9df9859612dfddea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f2c66c664751222bfc358695a6" ON "user_colocation" ("role") `);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "lastname" character varying NOT NULL, "firstname" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_cace4a159ff9f2512dd4237376" ON "user" ("id") `);
        await queryRunner.query(`CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
        await queryRunner.query(`ALTER TABLE "user_colocation" ADD CONSTRAINT "FK_de8b287c253f26e65a34195905d" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_colocation" ADD CONSTRAINT "FK_0eb9ec8bf129657d187a99c9a52" FOREIGN KEY ("colocationId") REFERENCES "colocation"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_colocation" DROP CONSTRAINT "FK_0eb9ec8bf129657d187a99c9a52"`);
        await queryRunner.query(`ALTER TABLE "user_colocation" DROP CONSTRAINT "FK_de8b287c253f26e65a34195905d"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cace4a159ff9f2512dd4237376"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f2c66c664751222bfc358695a6"`);
        await queryRunner.query(`DROP TABLE "user_colocation"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_e628d3686c0b7ef5c480bf89e7"`);
        await queryRunner.query(`DROP TABLE "colocation"`);
    }

}
