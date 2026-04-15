import { Column, Entity } from 'typeorm';
import { IEntity } from '../../../../aop/db/entities/entity';

@Entity('ministry_followup_logs')
export class MinistryFollowupLog extends IEntity {
  @Column({ type: 'uuid', name: 'assignment_id' })
  assignmentId: string;

  @Column({ type: 'int', name: 'leader_id' })
  leaderId: number;

  @Column({ type: 'int', name: 'member_id' })
  memberId: number;

  @Column({ type: 'text' })
  comment: string;

  @Column({ type: 'timestamp', name: 'reached_out_at' })
  reachedOutAt: Date;

  @Column({ type: 'date', name: 'week_start' })
  weekStart: string;
}
