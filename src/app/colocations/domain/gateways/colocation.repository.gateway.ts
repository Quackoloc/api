import { Colocation } from '../entities/colocation.entity';
import { FindManyOptions, FindOptionsRelations } from 'typeorm';
import { Nullable } from '../../../../common/types/nullable.type';

export interface ColocationRepositoryGateway {
  save(colocation: Colocation): Promise<Colocation>;

  find(options?: FindManyOptions<Colocation>): Promise<Colocation[]>;

  findMemberColocations(userId: number): Promise<Colocation[]>;

  findById(id: number): Promise<Nullable<Colocation>>;

  getById(id: number, options?: FindOptionsRelations<Colocation>): Promise<Colocation>;
}

export const ColocationRepositoryToken = 'ColocationRepositoryToken';
