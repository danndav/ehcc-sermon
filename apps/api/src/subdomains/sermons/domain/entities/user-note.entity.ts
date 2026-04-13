import { Column, Entity } from 'typeorm';
import { IEntity } from '../../../../aop/db/entities/entity';

@Entity('user_notes')
export class UserNote extends IEntity {
  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'uuid', name: 'sermon_id' })
  sermonId: string;

  @Column({ type: 'int', nullable: true, name: 'transcript_timestamp' })
  transcriptTimestamp: number | null;

  @Column({ type: 'text' })
  noteText: string;

  @Column({ type: 'text', nullable: true, name: 'highlighted_text' })
  highlightedText: string | null;
}
