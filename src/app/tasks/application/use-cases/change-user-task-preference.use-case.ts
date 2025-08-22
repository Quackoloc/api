import { Inject, Injectable } from '@nestjs/common';
import {
  UserTaskPreferenceRepositoryGateway,
  UserTaskPreferenceRepositoryToken,
} from '../../domain/gateways/user-task-preference.repository.gateway';
import { UserTaskPreference } from '../../domain/entities/user-task-preference.entity';
import { ConnectedUser } from '../../../../common/types/connected-user.type';
import { UserTaskPreferenceDto } from '../dtos/user-task-preference.dto';
import {
  ColocationTaskRepositoryGateway,
  ColocationTaskRepositoryToken,
} from '../../domain/gateways/colocation-task.repository.gateway';
import { logger } from '../../../../config/logger.config';
import {
  CannotCreateUserTaskPreferenceException,
  MembersNotFoundException,
} from '../../../colocations/domain/colocation.exceptions';
import {
  ColocationRepositoryGateway,
  ColocationRepositoryToken,
} from '../../../colocations/domain/gateways/colocation.repository.gateway';

@Injectable()
export class ChangeUserTaskPreferenceUseCase {
  constructor(
    @Inject(UserTaskPreferenceRepositoryToken)
    private readonly userTaskPreferenceRepository: UserTaskPreferenceRepositoryGateway,
    @Inject(ColocationTaskRepositoryToken)
    private readonly colocationTaskRepository: ColocationTaskRepositoryGateway,
    @Inject(ColocationRepositoryToken)
    private readonly colocationRepository: ColocationRepositoryGateway
  ) {}

  async execute(
    colocationId: number,
    recurrentTaskId: number,
    userId: number,
    preference: boolean,
    connectedUser: ConnectedUser
  ) {
    const preferenceToUpdate = await this.userTaskPreferenceRepository.findOne({
      where: {
        taskId: recurrentTaskId,
        userId,
      },
    });

    if (!preferenceToUpdate) {
      const userIsColocationMember = await this.colocationRepository.isColocationMember(
        userId,
        colocationId
      );

      if (!userIsColocationMember) {
        throw new MembersNotFoundException(userId, colocationId);
      }

      const task = await this.colocationTaskRepository.getOneById(recurrentTaskId);

      if (!task.isRecurrent) {
        throw new CannotCreateUserTaskPreferenceException(recurrentTaskId);
      }

      const preferenceToCreate = new UserTaskPreference();
      preferenceToCreate.userId = userId;
      preferenceToCreate.taskId = recurrentTaskId;
      preferenceToCreate.isOptedIn = preference;

      const createdPreference = await this.userTaskPreferenceRepository.save(preferenceToCreate);

      logger.log(
        `Preference for task with id : ${recurrentTaskId} opted in by user with id : ${connectedUser.id} in colocation with id : ${colocationId}.`,
        'ChangeUserTaskPreferenceUseCase'
      );

      return UserTaskPreferenceDto.fromEntity(createdPreference);
    } else {
      preferenceToUpdate.isOptedIn = preference;
      const updatedPreference = await this.userTaskPreferenceRepository.save(preferenceToUpdate);

      logger.log(
        `Preference for task with id : ${recurrentTaskId} opted in by user with id : ${connectedUser.id} in colocation with id : ${colocationId}.`,
        'ChangeUserTaskPreferenceUseCase'
      );

      return UserTaskPreferenceDto.fromEntity(updatedPreference);
    }
  }
}
