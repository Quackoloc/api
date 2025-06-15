import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ColocationTaskPriority } from '../enums/colocation-task-priority.enum';
import { Colocation } from './colocation.entity';
import { User } from '../../../user/domain/entities/user.entity';
import { DatesEntity } from '../../../../common/entities/dates-entity';
import { ColocationTaskStatus } from '../enums/colocation-task-status.enum';

@Entity()
export class ColocationTask {
  @PrimaryGeneratedColumn()
  @Index()
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  dueDate: Date;

  @Column({
    type: 'enum',
    enum: ColocationTaskStatus,
    default: ColocationTaskStatus.TODO,
  })
  status: ColocationTaskStatus;

  @Column({
    type: 'enum',
    enum: ColocationTaskPriority,
    default: ColocationTaskPriority.MEDIUM,
  })
  priority: ColocationTaskPriority;

  @Column()
  colocationId: number;

  @ManyToOne(() => Colocation, (colocation) => colocation.tasks)
  colocation: Colocation;

  @Column()
  assignedToId: number;

  @ManyToOne(() => User, (user) => user.tasks)
  assignedTo: User;

  @Column(() => DatesEntity, { prefix: false })
  dates: DatesEntity;
}
