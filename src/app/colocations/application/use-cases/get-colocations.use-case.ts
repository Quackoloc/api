import { Inject, Injectable } from '@nestjs/common';
import {
  ColocationRepositoryGateway,
  ColocationRepositoryToken,
} from '../../domain/gateways/colocation.repository.gateway';
import { ConnectedUser } from '../../../../common/types/connected-user.type';
import { ColocationDto } from '../dtos/colocation.dto';

@Injectable()
export class GetColocationsUseCase {
  constructor(
    @Inject(ColocationRepositoryToken)
    private readonly colocationRepository: ColocationRepositoryGateway
  ) {}

  async execute(connectedUser: ConnectedUser): Promise<ColocationDto[]> {
    const colocations = await this.colocationRepository.findMemberColocations(connectedUser.id);
    return colocations.map((colocation) => ColocationDto.fromEntity(colocation));
  }
}
