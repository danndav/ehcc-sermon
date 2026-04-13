import { Column, Entity } from 'typeorm';
import { IEntity } from '../../../../aop/db/entities/entity';

@Entity('prayer_recordings')
export class PrayerRecording extends IEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', nullable: true, name: 'led_by' })
  ledBy: string | null;

  @Column({ type: 'varchar', nullable: true, name: 'video_url' })
  videoUrl: string | null;

  @Column({ type: 'varchar', nullable: true, name: 'audio_url' })
  audioUrl: string | null;

  @Column({ type: 'int', nullable: true })
  duration: number | null;

  @Column({ type: 'text', nullable: true })
  transcript: string | null;

  @Column({ type: 'timestamp', nullable: true, name: 'recorded_at' })
  recordedAt: Date | null;
}
