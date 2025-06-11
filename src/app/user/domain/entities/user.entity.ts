import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { DatesEntity } from '../../../../common/entities/dates-entity';
import { hash } from 'bcryptjs';
import { Colocation } from '../../../colocations/domain/entities/colocation.entity';

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

  @Column(() => DatesEntity, { prefix: false })
  dates: DatesEntity;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }
}
