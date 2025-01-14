import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Colocation } from './colocation.entity';

@Entity()
export class UserColocation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.userColocations)
  user: User;

  @ManyToOne(() => Colocation, (colocation) => colocation.userColocations)
  colocation: Colocation;

  @Column()
  @Index()
  role: 'owner' | 'member';
}
