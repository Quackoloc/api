import { Inject, Injectable } from '@nestjs/common';
import {
  ColocationTaskRepositoryGateway,
  ColocationTaskRepositoryToken,
} from '../../domain/gateways/colocation-task.repository.gateway';
import { ColocationTaskDto } from '../dtos/colocation-task.dto';

@Injectable()
export class GetColocationTasksUseCase {
  constructor(
    @Inject(ColocationTaskRepositoryToken)
    private readonly colocationTaskRepository: ColocationTaskRepositoryGateway
  ) {}

  async execute(colocationId: number): Promise<ColocationTaskDto[]> {
    const tasks = await this.colocationTaskRepository.findByColocationId(colocationId);

    return tasks.map((task) => ColocationTaskDto.fromEntity(task));
  }
}
