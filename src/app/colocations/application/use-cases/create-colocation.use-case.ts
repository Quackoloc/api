import { Inject, Injectable } from '@nestjs/common';
import {
  ColocationRepositoryGateway,
  ColocationRepositoryToken,
} from '../../domain/gateways/colocation.repository.gateway';
import { CreateColocationDto } from '../dtos/create-colocation.dto';
import { ConnectedUser } from '../../../../common/types/connected-user.type';
import {
  UserRepositoryGateway,
  UserRepositoryToken,
} from '../../../user/domain/gateways/user.repository.gateway';
import { Colocation } from '../../domain/entities/colocation.entity';
import { ColocationDto } from '../dtos/colocation.dto';
import { logger } from '../../../../config/logger.config';

@Injectable()
export class CreateColocationUseCase {
  constructor(
    @Inject(ColocationRepositoryToken)
    private readonly colocationRepository: ColocationRepositoryGateway,
    @Inject(UserRepositoryToken)
    private readonly userRepository: UserRepositoryGateway
  ) {}

  async execute(createColocationDto: CreateColocationDto, connectedUser: ConnectedUser) {
    const user = await this.userRepository.getById(connectedUser.id);

    const colocation = new Colocation();
    colocation.title = createColocationDto.title;
    colocation.address = createColocationDto.address;
    colocation.members = [user];
    colocation.backgroundImage = '';
    colocation.pendingMembers = [];
    colocation.invitationCodes = [];
    colocation.tasksRotationFrequency = 6;

    const savedColocation = await this.colocationRepository.save(colocation);

    logger.log(
      `Colocation with id : ${savedColocation.id} created by user with id : ${connectedUser.id}`,
      'CreateColocationUseCase'
    );

    return ColocationDto.fromEntity(savedColocation);
  }
}
