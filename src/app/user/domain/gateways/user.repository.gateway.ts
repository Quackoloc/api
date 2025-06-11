import { User } from '../entities/user.entity';
import { Nullable } from '../../../../common/types/nullable.type';
import { FindOneOptions } from 'typeorm';

export interface UserRepositoryGateway {
  save(user: User): Promise<User>;

  getOneByEmail(email: string): Promise<User>;

  findOneByEmail(email: string): Promise<Nullable<User>>;

  getById(id: number): Promise<User>;

  findOneById(id: number, relations?: FindOneOptions<User>['relations']): Promise<User>;
}

export const UserRepositoryToken = 'UserRepositoryToken';
