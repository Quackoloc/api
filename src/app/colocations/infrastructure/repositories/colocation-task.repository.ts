import { FindOptionsRelations, Repository } from 'typeorm';
import { ColocationTask } from '../../domain/entities/colocation-task.entity';
import { ColocationTaskRepositoryGateway } from '../../domain/gateways/colocation-task.repository.gateway';
import { Nullable } from 'src/common/types/nullable.type';
import { ColocationTaskNotFoundException } from '../../domain/colocation.exceptions';

export class ColocationTaskRepository
  extends Repository<ColocationTask>
  implements ColocationTaskRepositoryGateway
{
  async findByColocationId(colocationId: number): Promise<ColocationTask[]> {
    return await this.createQueryBuilder('task')
      .leftJoinAndSelect('task.colocation', 'colocation')
      .leftJoinAndSelect('task.assignedTo', 'assignedTo')
      .where('task.colocationId = :colocationId', { colocationId })
      .getMany();
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
