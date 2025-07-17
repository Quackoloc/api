import { ColocationTask } from '../entities/colocation-task.entity';
import { Nullable } from '../../../../common/types/nullable.type';
import { FindOptionsRelations } from 'typeorm';

export interface ColocationTaskRepositoryGateway {
  save(colocationTask: ColocationTask): Promise<ColocationTask>;

  getOneById(id: number, options?: FindOptionsRelations<ColocationTask>): Promise<ColocationTask>;

  findById(
    id: number,
    options?: FindOptionsRelations<ColocationTask>
  ): Promise<Nullable<ColocationTask>>;

  findByColocationId(
    colocationId: number,
    options?: FindOptionsRelations<ColocationTask>
  ): Promise<ColocationTask[]>;
}

export const ColocationTaskRepositoryToken = 'ColocationTaskRepositoryToken';
