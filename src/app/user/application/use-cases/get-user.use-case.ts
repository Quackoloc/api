import {
  UserRepositoryGateway,
  UserRepositoryToken,
} from '../../domain/gateways/user.repository.gateway';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject(UserRepositoryToken)
    private readonly userRepository: UserRepositoryGateway
  ) {}

  async execute(id: number) {
    return await this.userRepository.getById(id);
  }
}
