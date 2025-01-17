import { Column, Entity, Index, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DatesEntity } from '../../../common/entities/dates-entity';
import { User } from '../../users/entities/user.entity';
import { PendingUser } from '../../users/entities/pending-user.entity';

@Entity()
export class Colocation {
  @PrimaryGeneratedColumn()
  @Index()
  id: number;

  @Column()
  title: string;

  @Column()
  address: string;

  @OneToMany(() => User, (user) => user.colocation)
  members: User[];

  @ManyToMany(() => PendingUser, (pendingUser) => pendingUser.colocations)
  pendingMembers: PendingUser[];

  @Column(() => DatesEntity, { prefix: false })
  dates: DatesEntity;
}
