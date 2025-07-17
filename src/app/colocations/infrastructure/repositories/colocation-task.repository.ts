import { FindOptionsRelations, Repository } from 'typeorm';
import { ColocationTask } from '../../domain/entities/colocation-task.entity';
import { ColocationTaskRepositoryGateway } from '../../domain/gateways/colocation-task.repository.gateway';
import { Nullable } from 'src/common/types/nullable.type';
import { ColocationTaskNotFoundException } from '../../domain/colocation.exceptions';

export class ColocationTaskRepository
  extends Repository<ColocationTask>
  implements ColocationTaskRepositoryGateway
{
  async findByColocationId(
    colocationId: number,
    options?: FindOptionsRelations<ColocationTask>
  ): Promise<ColocationTask[]> {
    return this.find({
      where: { colocation: { id: colocationId } },
      relations: options,
    });
  }

  getOneById(id: number, options?: FindOptionsRelations<ColocationTask>): Promise<ColocationTask> {
    const task = this.findOne({ where: { id }, relations: options });

    if (!task) {
      throw new ColocationTaskNotFoundException(id);
    }

    return task;
  }

  async findById(
    id: number,
    options?: FindOptionsRelations<ColocationTask>
  ): Promise<Nullable<ColocationTask>> {
    return await this.findOne({ where: { id }, relations: options });
  }
}
