import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DatesEntity } from '../../../../common/entities/dates-entity';
import { User } from '../../../user/domain/entities/user.entity';
import { PendingUser } from '../../../user/domain/entities/pending-user.entity';
import { InvitationCode } from './invitation-code.entity';
import { ColocationTask } from './colocation-task.entity';

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

  @OneToMany(() => ColocationTask, (colocationTask) => colocationTask.colocation)
  tasks: ColocationTask[];

  @Column({ default: 7 })
  tasksRotationFrequency: number;

  @Column({ type: 'timestamptz' })
  nextRotationDate: Date;

  @OneToMany(() => InvitationCode, (invitationCode) => invitationCode.colocation)
  invitationCodes: InvitationCode[];

  @ManyToMany(() => PendingUser, (pendingUser) => pendingUser.colocations)
  pendingMembers: PendingUser[];

  @Column(() => DatesEntity, { prefix: false })
  dates: DatesEntity;

  @BeforeInsert()
  setNextRotationDate() {
    if (this.tasksRotationFrequency != null) {
      const now = new Date();

      const utcNow = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

      utcNow.setUTCDate(utcNow.getUTCDate() + this.tasksRotationFrequency);
      utcNow.setUTCHours(16, 0, 0, 0);

      this.nextRotationDate = utcNow;
    }
  }
}
