import { Inject, Injectable } from '@nestjs/common';
import {
  ColocationRepositoryGateway,
  ColocationRepositoryToken,
} from '../../domain/gateways/colocation.repository.gateway';

@Injectable()
export class IsColocationMemberUseCase {
  constructor(
    @Inject(ColocationRepositoryToken)
    private readonly colocationRepository: ColocationRepositoryGateway
  ) {}

  async execute(userId: number, colocationId: number): Promise<boolean> {
    const colocation = await this.colocationRepository.getById(colocationId, {
      members: true,
    });

    const response = !!colocation.members.find((member) => member.id === userId);

    return response;
  }
}
