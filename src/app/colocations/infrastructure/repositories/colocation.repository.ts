import { FindOptionsRelations, Repository } from 'typeorm';
import { Colocation } from '../../domain/entities/colocation.entity';
import { ColocationRepositoryGateway } from '../../domain/gateways/colocation.repository.gateway';
import { ColocationNotFoundException } from '../../domain/colocation.exceptions';

export class ColocationRepository
  extends Repository<Colocation>
  implements ColocationRepositoryGateway
{
  async getById(id: number, options?: FindOptionsRelations<Colocation>): Promise<Colocation> {
    const colocation = await this.findById(id, options);

    if (!colocation) {
      throw new ColocationNotFoundException(id);
    }

    return colocation;
  }

  async findMemberColocations(userId: number): Promise<Colocation[]> {
    return await this.createQueryBuilder('colocation')
      .leftJoin('colocation.members', 'filteredMember') // pour le filtrage
      .leftJoinAndSelect('colocation.members', 'allMembers') // pour charger tous les membres
      .where('filteredMember.id = :userId', { userId })
      .getMany();
  }

  async findById(id: number, options?: FindOptionsRelations<Colocation>): Promise<Colocation> {
    return this.createQueryBuilder('colocation')
      .leftJoinAndSelect('colocation.members', 'members')
      .where('colocation.id = :id', { id })
      .getOne();
  }
}
