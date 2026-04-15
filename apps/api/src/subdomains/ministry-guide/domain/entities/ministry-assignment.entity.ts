import { Column, Entity } from 'typeorm';
import { IEntity } from '../../../../aop/db/entities/entity';

@Entity('ministry_assignments')
export class MinistryAssignment extends IEntity {
  @Column({ type: 'int', name: 'leader_id' })
  leaderId: number;

  @Column({ type: 'int', name: 'member_id' })
  memberId: number;

  @Column({ type: 'int', nullable: true, name: 'branch_id' })
  branchId: number | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;
}
