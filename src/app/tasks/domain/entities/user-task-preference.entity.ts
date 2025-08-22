import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../../user/domain/entities/user.entity';
import { ColocationTask } from './colocation-task.entity';

@Entity()
export class UserTaskPreference {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: true })
  isOptedIn: boolean;

  @Column()
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  taskId: number;

  @ManyToOne(() => ColocationTask, (task) => task.userPreferences)
  @JoinColumn({ name: 'taskId' })
  task: ColocationTask;

  @Column({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;
}
