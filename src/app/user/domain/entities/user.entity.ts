import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { DatesEntity } from '../../../../common/entities/dates-entity';
import { hash } from 'bcryptjs';
import { Colocation } from '../../../colocations/domain/entities/colocation.entity';
import { ColocationTask } from '../../../tasks/domain/entities/colocation-task.entity';

@Entity()
@Unique(['email'])
export class User {
  @PrimaryGeneratedColumn()
  @Index()
  id: number;

  @Column({ unique: true })
  @Index()
  email: string;

  @Column()
  avatar: string;

  @Column()
  lastname: string;

  @Column()
  firstname: string;

  @Column()
  password: string;

  @ManyToOne(() => Colocation, (colocation) => colocation.members, { nullable: true })
  colocation: Colocation;

  @OneToMany(() => ColocationTask, (colocationTask) => colocationTask.assignedTo)
  tasks: ColocationTask[];

  @Column(() => DatesEntity, { prefix: false })
  dates: DatesEntity;

  @BeforeInsert()
  async hashPasswordBeforeInsert() {
    this.password = await this.generatePasswordHash(this.password);
  }

  async generatePasswordHash(password: string) {
    return await hash(password, 10);
  }
}
