import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { DatesEntity } from '../../../common/entities/dates-entity';
import { hash } from 'bcryptjs';
import { UserColocation } from '../../colocations/entities/user-colocation.entity';

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
  lastname: string;

  @Column()
  firstname: string;

  @Column()
  password: string;

  @OneToMany(() => UserColocation, (userColocation) => userColocation.user)
  userColocations: UserColocation[];

  @Column(() => DatesEntity, { prefix: false })
  dates: DatesEntity;

  @BeforeInsert()
  async hashPassword() {
    this.password = await hash(this.password, 10);
  }
}
