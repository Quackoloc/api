import { Colocation } from '../entities/colocation.entity';
import { FindManyOptions } from 'typeorm';

export interface ColocationRepositoryGateway {
  save(colocation: Colocation): Promise<Colocation>;

  find(options?: FindManyOptions<Colocation>): Promise<Colocation[]>;

  findById(id: number): Promise<Colocation>;
}

export const ColocationRepositoryToken = 'ColocationRepositoryToken';
