import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Colocation } from '../../colocations/entities/colocation.entity';

@Entity()
@Unique(['email'])
export class PendingUser {
  @PrimaryGeneratedColumn()
  @Index()
  id: number;

  @Column({ unique: true })
  @Index()
  email: string;

  @ManyToMany(() => Colocation, (colocation) => colocation.pendingMembers)
  @JoinTable()
  colocations: Colocation[];
}
