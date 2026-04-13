import { Column, Entity } from 'typeorm';
import { IEntity } from '../../../../aop/db/entities/entity';

@Entity('watch_history')
export class WatchHistory extends IEntity {
  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'uuid', name: 'sermon_id' })
  sermonId: string;

  @Column({ type: 'int', default: 0, name: 'progress_seconds' })
  progressSeconds: number;

  @Column({ type: 'boolean', default: false })
  completed: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'last_watched_at' })
  lastWatchedAt: Date | null;
}
