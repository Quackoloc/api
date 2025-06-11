import { Repository } from 'typeorm';
import { Colocation } from '../../domain/entities/colocation.entity';
import { ColocationRepositoryGateway } from '../../domain/gateways/colocation.repository.gateway';

export class ColocationRepository
  extends Repository<Colocation>
  implements ColocationRepositoryGateway
{
  async findById(id: number): Promise<Colocation> {
    return this.findOne({ where: { id } });
  }
}
