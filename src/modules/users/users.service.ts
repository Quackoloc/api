import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { In, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UserDto } from './dto/user.dto';
import { Colocation } from '../colocations/entities/colocation.entity';
import { PendingUser } from './entities/pending-user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(PendingUser)
    private readonly pendingUserRepository: Repository<PendingUser>
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDto> {
    try {
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save(user);

      return UserDto.fromEntity(user);
    } catch (err) {}
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async findByEmails(emails: string[]): Promise<User[]> {
    return this.userRepository.find({
      where: {
        email: In(emails),
      },
    });
  }

  async getOneById(id: number): Promise<UserDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    return UserDto.fromEntity(user);
  }

  async createPendingUser(email: string, colocations: Colocation[] = []): Promise<PendingUser> {
    const pendingUser = this.pendingUserRepository.create({
      email,
      colocations,
    });

    return this.savePendingUser(pendingUser); // Utilise savePendingUser pour persister
  }

  async findPendingUserByEmail(email: string): Promise<PendingUser | null> {
    return this.pendingUserRepository.findOne({
      where: { email },
      relations: ['colocations'], // Charge les colocations associées
    });
  }

  async savePendingUser(pendingUser: PendingUser): Promise<PendingUser> {
    return this.pendingUserRepository.save(pendingUser);
  }

  findOneById(id: number, relations?: any): Promise<User> {
    return this.userRepository.findOne({ where: { id }, relations });
  }
}
