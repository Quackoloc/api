import { DataSource } from 'typeorm';

import * as dotenv from 'dotenv';
import { Colocation } from '../app/colocations/domain/entities/colocation.entity';
import { User } from '../app/user/domain/entities/user.entity';
import { ColocationTask } from '../app/tasks/domain/entities/colocation-task.entity';
import { PendingUser } from '../app/user/domain/entities/pending-user.entity';
import { InvitationCode } from '../app/colocations/domain/entities/invitation-code.entity';
import { UserTaskPreference } from '../app/tasks/domain/entities/user-task-preference.entity';
import { ColocationRepository } from '../app/colocations/infrastructure/repositories/colocation.repository';
import { ColocationTaskRepository } from '../app/tasks/infrastructure/repositories/colocation-task.repository';
import { InvitationCodeRepository } from '../app/colocations/infrastructure/repositories/invitation-code.repository';
import { UserTaskPreferenceRepository } from '../app/tasks/infrastructure/repositories/user-task-preference.repository';

dotenv.config();

let dataSource: DataSource;

export async function initializeTestDataSource(): Promise<DataSource> {
  const ds = new DataSource({
    type: 'postgres',
    host: process.env.TEST_DB_HOST || 'localhost',
    port: Number(process.env.TEST_DB_PORT) || 5432,
    username: process.env.TEST_DB_USER || 'postgres',
    password: process.env.TEST_DB_PASSWORD || 'postgres',
    database: process.env.TEST_DB_NAME || 'test_db',
    synchronize: true,
    dropSchema: true,
    entities: [Colocation, User, ColocationTask, PendingUser, InvitationCode, UserTaskPreference],
  });

  await ds.initialize();
  return ds;
}

export async function clearTables(ds: DataSource) {
  const entities = ds.entityMetadatas;
  const tableNames = entities.map((entity) => `"${entity.tableName}"`).join(', ');

  if (tableNames.length > 0) {
    await ds.query(`TRUNCATE ${tableNames} RESTART IDENTITY CASCADE;`);
  }
}

export function getColocationRepository(ds: DataSource): ColocationRepository {
  return new ColocationRepository(
    ds.getRepository(Colocation).target,
    ds.getRepository(Colocation).manager,
    ds.getRepository(Colocation).queryRunner
  );
}

export function getColocationTaskRepository(ds: DataSource): ColocationTaskRepository {
  return new ColocationTaskRepository(
    ds.getRepository(ColocationTask).target,
    ds.getRepository(ColocationTask).manager,
    ds.getRepository(ColocationTask).queryRunner
  );
}

export function getInvitationCodeRepository(ds: DataSource): InvitationCodeRepository {
  return new InvitationCodeRepository(
    ds.getRepository(InvitationCode).target,
    ds.getRepository(InvitationCode).manager,
    ds.getRepository(InvitationCode).queryRunner
  );
}

export function getUserTaskPreferenceRepository(ds: DataSource): UserTaskPreferenceRepository {
  return new UserTaskPreferenceRepository(
    ds.getRepository(UserTaskPreference).target,
    ds.getRepository(UserTaskPreference).manager,
    ds.getRepository(UserTaskPreference).queryRunner
  );
}

export { dataSource };
