import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './domain/entities/user.entity';
import { Repository } from 'typeorm';
import { UserDto } from './application/dtos/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async getOneById(id: number): Promise<UserDto> {
    const user = await this.userRepository.findOne({ where: { id } });
    return UserDto.fromEntity(user);
  }

  findOneById(id: number, relations?: any): Promise<User> {
    return this.userRepository.findOne({ where: { id }, relations });
  }
}
