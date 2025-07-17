import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1752696870376 implements MigrationInterface {
  name = 'Migration1752696870376';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE "colocation_task"
                             (
                                 "id"           SERIAL                                   NOT NULL,
                                 "title"        character varying                        NOT NULL,
                                 "description"  character varying                        NOT NULL,
                                 "dueDate"      TIMESTAMP                                NOT NULL,
                                 "status"       "public"."colocation_task_status_enum"   NOT NULL DEFAULT 'todo',
                                 "priority"     "public"."colocation_task_priority_enum" NOT NULL DEFAULT 'medium',
                                 "colocationId" integer                                  NOT NULL,
                                 "assignedToId" integer                                  NOT NULL,
                                 "createdAt"    TIMESTAMP WITH TIME ZONE                 NOT NULL DEFAULT now(),
                                 "updatedAt"    TIMESTAMP WITH TIME ZONE                 NOT NULL DEFAULT now(),
                                 "deletedAt"    TIMESTAMP WITH TIME ZONE,
                                 CONSTRAINT "PK_a0056fb4bfd782b0600bc1011a3" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_a0056fb4bfd782b0600bc1011a" ON "colocation_task" ("id") `
    );
    await queryRunner.query(`CREATE TABLE "user"
                             (
                                 "id"           SERIAL                   NOT NULL,
                                 "email"        character varying        NOT NULL,
                                 "avatar"       character varying        NOT NULL,
                                 "lastname"     character varying        NOT NULL,
                                 "firstname"    character varying        NOT NULL,
                                 "password"     character varying        NOT NULL,
                                 "colocationId" integer,
                                 "createdAt"    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                 "updatedAt"    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                 "deletedAt"    TIMESTAMP WITH TIME ZONE,
                                 CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                                 CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                                 CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(`CREATE INDEX "IDX_cace4a159ff9f2512dd4237376" ON "user" ("id") `);
    await queryRunner.query(`CREATE INDEX "IDX_e12875dfb3b1d92d7d7c5377e2" ON "user" ("email") `);
    await queryRunner.query(`CREATE TABLE "invitation_code"
                             (
                                 "id"           SERIAL                   NOT NULL,
                                 "code"         character varying        NOT NULL,
                                 "expiresAt"    TIMESTAMP WITH TIME ZONE NOT NULL,
                                 "colocationId" integer                  NOT NULL,
                                 "createdAt"    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                 "updatedAt"    TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                 "deletedAt"    TIMESTAMP WITH TIME ZONE,
                                 CONSTRAINT "PK_fa9e818ade61aeee63f5d89baea" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_fa9e818ade61aeee63f5d89bae" ON "invitation_code" ("id") `
    );
    await queryRunner.query(`CREATE TABLE "colocation"
                             (
                                 "id"                     SERIAL                   NOT NULL,
                                 "title"                  character varying        NOT NULL,
                                 "backgroundImage"        character varying        NOT NULL,
                                 "address"                character varying        NOT NULL,
                                 "tasksRotationFrequency" integer                  NOT NULL DEFAULT '6',
                                 "nextRotationDate"       TIMESTAMP WITH TIME ZONE NOT NULL,
                                 "createdAt"              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                 "updatedAt"              TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
                                 "deletedAt"              TIMESTAMP WITH TIME ZONE,
                                 CONSTRAINT "PK_e628d3686c0b7ef5c480bf89e7c" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_e628d3686c0b7ef5c480bf89e7" ON "colocation" ("id") `
    );
    await queryRunner.query(`CREATE TABLE "pending_user"
                             (
                                 "id"    SERIAL            NOT NULL,
                                 "email" character varying NOT NULL,
                                 CONSTRAINT "UQ_df7ff5a4672a3479c641cd67191" UNIQUE ("email"),
                                 CONSTRAINT "UQ_df7ff5a4672a3479c641cd67191" UNIQUE ("email"),
                                 CONSTRAINT "PK_ea2c9c5daf7f8339c58f5325734" PRIMARY KEY ("id")
                             )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_ea2c9c5daf7f8339c58f532573" ON "pending_user" ("id") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_df7ff5a4672a3479c641cd6719" ON "pending_user" ("email") `
    );
    await queryRunner.query(`CREATE TABLE "pending_user_colocations_colocation"
                             (
                                 "pendingUserId" integer NOT NULL,
                                 "colocationId"  integer NOT NULL,
                                 CONSTRAINT "PK_9a7d88ee8aa298819ee32a02df8" PRIMARY KEY ("pendingUserId", "colocationId")
                             )`);
    await queryRunner.query(
      `CREATE INDEX "IDX_378af6978f5e6fce16e4004add" ON "pending_user_colocations_colocation" ("pendingUserId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_0d5205512f7e67a1b4293bac17" ON "pending_user_colocations_colocation" ("colocationId") `
    );
    await queryRunner.query(`ALTER TABLE "colocation_task"
        ADD CONSTRAINT "FK_3b0f8a86e7b48c0e25fb49517f2" FOREIGN KEY ("colocationId") REFERENCES "colocation" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "colocation_task"
        ADD CONSTRAINT "FK_d973ee0b96d08391d55d4260b43" FOREIGN KEY ("assignedToId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "user"
        ADD CONSTRAINT "FK_a98e72db554a8a04b6c200685e8" FOREIGN KEY ("colocationId") REFERENCES "colocation" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "invitation_code"
        ADD CONSTRAINT "FK_bd5900b974fcfabb08f0faaae49" FOREIGN KEY ("colocationId") REFERENCES "colocation" ("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "pending_user_colocations_colocation"
        ADD CONSTRAINT "FK_378af6978f5e6fce16e4004add6" FOREIGN KEY ("pendingUserId") REFERENCES "pending_user" ("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    await queryRunner.query(`ALTER TABLE "pending_user_colocations_colocation"
        ADD CONSTRAINT "FK_0d5205512f7e67a1b4293bac174" FOREIGN KEY ("colocationId") REFERENCES "colocation" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    await queryRunner.query(`ALTER TABLE "colocation_task"
        ADD "isRecurrent" boolean NOT NULL DEFAULT false`);
    await queryRunner.query(`ALTER TABLE "colocation_task" DROP COLUMN "dueDate"`);
    await queryRunner.query(`ALTER TABLE "colocation_task"
        ADD "dueDate" TIMESTAMP WITH TIME ZONE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "pending_user_colocations_colocation" DROP CONSTRAINT "FK_0d5205512f7e67a1b4293bac174"`
    );
    await queryRunner.query(
      `ALTER TABLE "pending_user_colocations_colocation" DROP CONSTRAINT "FK_378af6978f5e6fce16e4004add6"`
    );
    await queryRunner.query(
      `ALTER TABLE "invitation_code" DROP CONSTRAINT "FK_bd5900b974fcfabb08f0faaae49"`
    );
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_a98e72db554a8a04b6c200685e8"`);
    await queryRunner.query(
      `ALTER TABLE "colocation_task" DROP CONSTRAINT "FK_d973ee0b96d08391d55d4260b43"`
    );
    await queryRunner.query(
      `ALTER TABLE "colocation_task" DROP CONSTRAINT "FK_3b0f8a86e7b48c0e25fb49517f2"`
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_0d5205512f7e67a1b4293bac17"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_378af6978f5e6fce16e4004add"`);
    await queryRunner.query(`DROP TABLE "pending_user_colocations_colocation"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_df7ff5a4672a3479c641cd6719"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ea2c9c5daf7f8339c58f532573"`);
    await queryRunner.query(`DROP TABLE "pending_user"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e628d3686c0b7ef5c480bf89e7"`);
    await queryRunner.query(`DROP TABLE "colocation"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_fa9e818ade61aeee63f5d89bae"`);
    await queryRunner.query(`DROP TABLE "invitation_code"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_e12875dfb3b1d92d7d7c5377e2"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_cace4a159ff9f2512dd4237376"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_a0056fb4bfd782b0600bc1011a"`);
    await queryRunner.query(`DROP TABLE "colocation_task"`);
    await queryRunner.query(`ALTER TABLE "colocation_task" DROP COLUMN "dueDate"`);
    await queryRunner.query(`ALTER TABLE "colocation_task"
        ADD "dueDate" TIMESTAMP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "colocation_task" DROP COLUMN "isRecurrent"`);
  }
}
