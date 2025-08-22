import { FindOptionsRelations, Repository } from 'typeorm';
import { UserTaskPreference } from '../../domain/entities/user-task-preference.entity';
import { UserTaskPreferenceRepositoryGateway } from '../../domain/gateways/user-task-preference.repository.gateway';
import { UserTaskPreferenceNotFoundException } from '../../../colocations/domain/colocation.exceptions';

export class UserTaskPreferenceRepository
  extends Repository<UserTaskPreference>
  implements UserTaskPreferenceRepositoryGateway
{
  getOneById(
    id: number,
    options?: FindOptionsRelations<UserTaskPreference>
  ): Promise<UserTaskPreference> {
    const userTaskPreference = this.findOne({ where: { id }, relations: options });

    if (!userTaskPreference) {
      throw new UserTaskPreferenceNotFoundException(id);
    }

    return userTaskPreference;
  }
}
