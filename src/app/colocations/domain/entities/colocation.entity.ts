import { Column, Entity, Index, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DatesEntity } from '../../../../common/entities/dates-entity';
import { User } from '../../../user/domain/entities/user.entity';
import { PendingUser } from '../../../user/domain/entities/pending-user.entity';
import { InvitationCode } from './invitation-code.entity';

@Entity()
export class Colocation {
  @PrimaryGeneratedColumn()
  @Index()
  id: number;

  @Column()
  title: string;

  @Column()
  backgroundImage: string;

  @Column()
  address: string;

  @OneToMany(() => User, (user) => user.colocation)
  members: User[];

  @OneToMany(() => InvitationCode, (invitationCode) => invitationCode.colocation)
  invitationCodes: InvitationCode[];

  @ManyToMany(() => PendingUser, (pendingUser) => pendingUser.colocations)
  pendingMembers: PendingUser[];

  @Column(() => DatesEntity, { prefix: false })
  dates: DatesEntity;
}
