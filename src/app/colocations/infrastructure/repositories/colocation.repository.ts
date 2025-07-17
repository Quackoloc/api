import { Between, Repository } from 'typeorm';
import { Colocation } from '../../domain/entities/colocation.entity';
import { ColocationRepositoryGateway } from '../../domain/gateways/colocation.repository.gateway';
import { ColocationNotFoundException } from '../../domain/colocation.exceptions';

export class ColocationRepository
  extends Repository<Colocation>
  implements ColocationRepositoryGateway
{
  async getById(id: number): Promise<Colocation> {
    const colocation = await this.findById(id);

    if (!colocation) {
      throw new ColocationNotFoundException(id);
    }

    return colocation;
  }

  async findMemberColocations(userId: number): Promise<Colocation[]> {
    return await this.createQueryBuilder('colocation')
      .leftJoin('colocation.members', 'filteredMember')
      .leftJoinAndSelect('colocation.members', 'allMembers')
      .where('filteredMember.id = :userId', { userId })
      .getMany();
  }

  async findById(id: number): Promise<Colocation> {
    return this.createQueryBuilder('colocation')
      .leftJoinAndSelect('colocation.members', 'members')
      .where('colocation.id = :id', { id })
      .getOne();
  }

  async findByRotationDate(rotationDate: Date): Promise<Colocation[]> {
    const tomorrow = new Date(rotationDate);
    tomorrow.setUTCDate(rotationDate.getUTCDate() + 1);

    return this.find({
      where: {
        nextRotationDate: Between(rotationDate, tomorrow),
      },
      relations: ['members'],
    });
  }
}
