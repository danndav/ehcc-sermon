import { Column, Entity } from 'typeorm';
import { IEntity } from '../../../../aop/db/entities/entity';

@Entity('ministry_weekly_reports')
export class MinistryWeeklyReport extends IEntity {
  @Column({ type: 'int', name: 'leader_id' })
  leaderId: number;

  @Column({ type: 'date', name: 'week_start' })
  weekStart: string;

  @Column({ type: 'text' })
  report: string;

  @Column({ type: 'text', nullable: true })
  challenges: string | null;

  @Column({ type: 'text', nullable: true, name: 'prayer_points' })
  prayerPoints: string | null;

  @Column({ type: 'int', nullable: true, name: 'branch_id' })
  branchId: number | null;
}
