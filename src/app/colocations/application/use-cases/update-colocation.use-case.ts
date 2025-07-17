import { Inject, Injectable } from '@nestjs/common';
import {
  ColocationRepositoryGateway,
  ColocationRepositoryToken,
} from '../../domain/gateways/colocation.repository.gateway';
import { UpdateColocationDto } from '../dtos/update-colocation.dto';
import { logger } from '../../../../config/logger.config';
import { ConnectedUser } from '../../../../common/types/connected-user.type';

@Injectable()
export class UpdateColocationUseCase {
  constructor(
    @Inject(ColocationRepositoryToken)
    private readonly colocationRepository: ColocationRepositoryGateway
  ) {}

  async execute(
    colocationId: number,
    updateColocationDto: UpdateColocationDto,
    connectedUser: ConnectedUser
  ) {
    const colocation = await this.colocationRepository.getById(colocationId);

    colocation.title = updateColocationDto.title;
    colocation.address = updateColocationDto.address;

    logger.log(
      `Colocation with id : ${colocationId} updated by user with id : ${connectedUser.id}`,
      'UpdateColocationUseCase'
    );

    await this.colocationRepository.save(colocation);
  }
}
