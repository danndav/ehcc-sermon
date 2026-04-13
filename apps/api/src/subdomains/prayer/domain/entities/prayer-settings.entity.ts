import { Column, Entity } from 'typeorm';
import { IEntity } from '../../../../aop/db/entities/entity';

@Entity('prayer_settings')
export class PrayerSettings extends IEntity {
  @Column({ type: 'varchar', nullable: true, name: 'teams_link' })
  teamsLink: string | null;

  @Column({ type: 'varchar', default: '00:00', name: 'meeting_time' })
  meetingTime: string;
}
