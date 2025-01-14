import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { DatesEntity } from '../../../common/entities/dates-entity';

@Entity()
export class Colocation extends DatesEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  address: string;

  @ManyToMany(() => User, (user) => user.colocations, { cascade: true })
  @JoinTable({
    name: 'colocation_users',
    joinColumn: { name: 'colocation_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'user_id', referencedColumnName: 'id' },
  })
  members: User[];
}
