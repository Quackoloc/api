import { UserTaskPreference } from '../entities/user-task-preference.entity';
import { FindOneOptions, FindOptionsRelations, InsertResult } from 'typeorm';
import { UpsertOptions } from 'typeorm/repository/UpsertOptions';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export interface UserTaskPreferenceRepositoryGateway {
  save(userTaskPreference: UserTaskPreference): Promise<UserTaskPreference>;

  getOneById(
    id: number,
    options?: FindOptionsRelations<UserTaskPreference>
  ): Promise<UserTaskPreference>;

  findOne(options: FindOneOptions<UserTaskPreference>): Promise<UserTaskPreference>;

  upsert(
    entityOrEntities:
      | QueryDeepPartialEntity<UserTaskPreference>
      | QueryDeepPartialEntity<UserTaskPreference>[],
    conflictPathsOrOptions: string[] | UpsertOptions<UserTaskPreference>
  ): Promise<InsertResult>;
}

export const UserTaskPreferenceRepositoryToken = 'UserTaskPreferenceRepositoryToken';
