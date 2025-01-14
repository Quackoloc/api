import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Colocation } from './entities/colocation.entity';
import { Repository } from 'typeorm';
import { CreateColocationDto } from './dtos/create-colocation.dto';
import { ConnectedUser } from '../auth/connected-user.model';
import { UsersService } from '../users/users.service';
import { ColocationDto } from './dtos/colocation.dto';
import { UserColocation } from './entities/user-colocation.entity';

@Injectable()
export class ColocationsService {
  constructor(
    @InjectRepository(Colocation)
    private readonly colocationRepository: Repository<Colocation>,
    @InjectRepository(UserColocation)
    private readonly userColocationRepository: Repository<UserColocation>,
    private readonly usersService: UsersService
  ) {}

  async createColocation(
    createColocationDto: CreateColocationDto,
    connectedUser: ConnectedUser
  ): Promise<ColocationDto> {
    const user = await this.usersService.findOneById(connectedUser.id);

    const colocation = new Colocation();
    colocation.title = createColocationDto.title;
    colocation.address = createColocationDto.address;
    const savedColocation = await this.colocationRepository.save(colocation);

    const userColocation = new UserColocation();
    userColocation.user = user;
    userColocation.colocation = savedColocation;
    userColocation.role = 'owner';
    await this.userColocationRepository.save(userColocation);

    const finalColocation = await this.findOneById(savedColocation.id, [
      'userColocations',
      'userColocations.user',
    ]);

    return ColocationDto.fromEntity(finalColocation);
  }

  private findOneById(id: number, relations?: any) {
    return this.colocationRepository.findOne({
      where: { id },
      relations,
    });
  }
}
