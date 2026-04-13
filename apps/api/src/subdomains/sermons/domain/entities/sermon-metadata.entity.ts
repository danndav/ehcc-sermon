import { Column, Entity, OneToOne, JoinColumn } from 'typeorm';
import { IEntity } from '../../../../aop/db/entities/entity';

@Entity('sermon_metadata')
export class SermonMetadata extends IEntity {
  @Column({ type: 'uuid', name: 'sermon_id', unique: true })
  sermonId: string;

  @Column({ type: 'text', nullable: true })
  summary: string | null;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[] | null;

  @Column({ type: 'text', nullable: true, name: 'transcript_text' })
  transcriptText: string | null;

  @Column({ type: 'jsonb', nullable: true, name: 'transcript_timestamps' })
  transcriptTimestamps: { start: number; end: number; text: string }[] | null;
}
