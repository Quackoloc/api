import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Colocation } from './colocation.entity';
import { DatesEntity } from '../../../../common/entities/dates-entity';

@Entity()
export class InvitationCode {
  @PrimaryGeneratedColumn()
  @Index()
  id: number;

  @Column()
  code: string;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ nullable: false })
  colocationId: number;

  @ManyToOne(() => Colocation, (colocation) => colocation.invitationCodes, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  colocation: Colocation;

  @Column(() => DatesEntity, { prefix: false })
  dates: DatesEntity;
}
