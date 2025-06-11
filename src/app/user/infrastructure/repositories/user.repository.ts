import { UserRepositoryGateway } from '../../domain/gateways/user.repository.gateway';
import { FindOneOptions, Repository } from 'typeorm';
import { User } from '../../domain/entities/user.entity';
import { Nullable } from 'src/common/types/nullable.type';
import { UserEmailNotFoundException } from '../../domain/user-exceptions';

export class UserRepository extends Repository<User> implements UserRepositoryGateway {
  getOneByEmail(email: string): Promise<User> {
    const user = this.findOneByEmail(email);

    if (!user) {
      throw new UserEmailNotFoundException(email);
    }

    return user;
  }

  findOneByEmail(email: string): Promise<Nullable<User>> {
    return this.findOne({ where: { email } });
  }

  getById(id: number): Promise<User> {
    return this.findOneById(id);
  }

  findOneById(id: number, relations?: FindOneOptions<User>['relations']): Promise<User> {
    return this.findOne({ where: { id }, relations });
  }
}
