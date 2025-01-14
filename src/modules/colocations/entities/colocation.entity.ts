import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { DatesEntity } from '../../../common/entities/dates-entity';
import { UserColocation } from './user-colocation.entity';

@Entity()
export class Colocation {
  @PrimaryGeneratedColumn()
  @Index()
  id: number;

  @Column()
  title: string;

  @Column()
  address: string;

  @OneToMany(() => UserColocation, (userColocation) => userColocation.colocation)
  userColocations: UserColocation[];

  @Column(() => DatesEntity, { prefix: false })
  dates: DatesEntity;
}
