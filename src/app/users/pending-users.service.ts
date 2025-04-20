import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PendingUser } from './entities/pending-user.entity';
import { Repository } from 'typeorm';
import { Colocation } from '../colocations/entities/colocation.entity';

@Injectable()
export class PendingUsersService {
  constructor(
    @InjectRepository(PendingUser)
    private readonly pendingUserRepository: Repository<PendingUser>
  ) {}

  async create(email: string, colocations: Colocation[] = []): Promise<PendingUser> {
    const pendingUser = this.pendingUserRepository.create({
      email,
      colocations,
    });

    return this.save(pendingUser); // Utilise savePendingUser pour persister
  }

  async findByEmail(email: string): Promise<PendingUser | null> {
    return this.pendingUserRepository.findOne({
      where: { email },
      relations: ['colocations'], // Charge les colocations associées
    });
  }

  async save(pendingUser: PendingUser): Promise<PendingUser> {
    return this.pendingUserRepository.save(pendingUser);
  }
}
