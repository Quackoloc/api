import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Colocation } from './entities/colocation.entity';
import { Repository } from 'typeorm';
import { CreateColocationDto } from './dtos/create-colocation.dto';
import { ConnectedUser } from '../auth/connected-user.model';
import { UsersService } from '../users/users.service';
import { ColocationDto } from './dtos/colocation.dto';
import { MailerService } from '../mailer/mailer.service';
import { PendingUsersService } from '../users/pending-users.service';

@Injectable()
export class ColocationsService {
  constructor(
    @InjectRepository(Colocation)
    private readonly colocationRepository: Repository<Colocation>,
    private readonly usersService: UsersService,
    private readonly pendingUsersService: PendingUsersService,
    private readonly mailerService: MailerService
  ) {}

  async createColocation(
    createColocationDto: CreateColocationDto,
    connectedUser: ConnectedUser
  ): Promise<ColocationDto> {
    const user = await this.usersService.findOneById(connectedUser.id);

    const colocation = new Colocation();
    colocation.title = createColocationDto.title;
    colocation.address = createColocationDto.address;
    colocation.members = [user];
    colocation.pendingMembers = [];

    const savedColocation = await this.colocationRepository.save(colocation);

    //todo: move to the method to invite pple in the colocation

    // savedColocation.pendingMembers = await Promise.all(
    //   pendingUsersEmails.map(async (email) => {
    //     let pendingUser = await this.pendingUsersService.findByEmail(email);
    //     if (!pendingUser) {
    //       pendingUser = await this.pendingUsersService.create(email);
    //     }
    //
    //     pendingUser.colocations = pendingUser.colocations || [];
    //     pendingUser.colocations.push(savedColocation);
    //
    //     await this.pendingUsersService.save(pendingUser);
    //
    //     return pendingUser;
    //   })
    // );

    // //todo: add a queue with BullMQ
    // this.mailerService.sendPendingUsersEmails(savedColocation.pendingMembers);

    return ColocationDto.fromEntity(savedColocation);
  }

  async getColocations(connectedUser: ConnectedUser) {
    const colocations = await this.colocationRepository.find({
      where: { members: connectedUser },
      relations: ['members', 'pendingMembers'],
    });

    return colocations.map((colocation) => ColocationDto.fromEntity(colocation));
  }

  private findOneById(id: number, relations?: any) {
    return this.colocationRepository.findOne({
      where: { id },
      relations,
    });
  }
}
