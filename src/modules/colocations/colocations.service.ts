import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Colocation } from './entities/colocation.entity';
import { Repository } from 'typeorm';
import { CreateColocationDto } from './dtos/create-colocation.dto';
import { ConnectedUser } from '../auth/connected-user.model';
import { UsersService } from '../users/users.service';
import { ColocationDto } from './dtos/colocation.dto';
import { MailerService } from '../mailer/mailer.service';

@Injectable()
export class ColocationsService {
  constructor(
    @InjectRepository(Colocation)
    private readonly colocationRepository: Repository<Colocation>,
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService
  ) {}

  async createColocation(
    createColocationDto: CreateColocationDto,
    connectedUser: ConnectedUser
  ): Promise<ColocationDto> {
    const user = await this.usersService.findOneById(connectedUser.id);

    const registeredUsers = await this.usersService.findByEmails(createColocationDto.members);
    registeredUsers.push(user);

    const pendingUsersEmails = createColocationDto.members.filter(
      (email) => !registeredUsers.find((user) => user.email === email)
    );

    const colocation = new Colocation();
    colocation.title = createColocationDto.title;
    colocation.address = createColocationDto.address;
    colocation.members = registeredUsers;

    const savedColocation = await this.colocationRepository.save(colocation);

    savedColocation.pendingMembers = await Promise.all(
      pendingUsersEmails.map(async (email) => {
        let pendingUser = await this.usersService.findPendingUserByEmail(email);
        if (!pendingUser) {
          pendingUser = await this.usersService.createPendingUser(email);
        }

        pendingUser.colocations = pendingUser.colocations || [];
        pendingUser.colocations.push(savedColocation);

        await this.usersService.savePendingUser(pendingUser);

        return pendingUser;
      })
    );

    await this.colocationRepository.save(savedColocation);

    const finalColocation = await this.findOneById(savedColocation.id, [
      'members',
      'pendingMembers',
    ]);

    //todo: add a queue with BullMQ
    this.mailerService.sendPendingUsersEmails(savedColocation.pendingMembers);

    return ColocationDto.fromEntity(finalColocation);
  }

  async getColocations(connectedUser: ConnectedUser) {
    // todo: refacto
  }

  private findOneById(id: number, relations?: any) {
    return this.colocationRepository.findOne({
      where: { id },
      relations,
    });
  }
}
