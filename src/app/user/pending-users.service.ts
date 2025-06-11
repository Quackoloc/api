import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PendingUser } from './domain/entities/pending-user.entity';
import { Repository } from 'typeorm';
import { Colocation } from '../colocations/domain/entities/colocation.entity';

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

  async save(pendingUser: PendingUser): Promise<PendingUser> {
    return this.pendingUserRepository.save(pendingUser);
  }
}
