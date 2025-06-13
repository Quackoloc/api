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
import { logger } from '../../../../common/logger';

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

    const savedColocation = await this.colocationRepository.save(colocation);

    logger.info(
      `Colocation with id : ${savedColocation.id} created by user with id : ${connectedUser.id}`
    );

    return ColocationDto.fromEntity(savedColocation);
  }
}
