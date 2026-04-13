import { Column, Entity } from 'typeorm';
import { IEntity } from '../../../../aop/db/entities/entity';

@Entity('devotionals')
export class Devotional extends IEntity {
  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'uuid', name: 'sermon_id' })
  sermonId: string;

  @Column({ type: 'jsonb', name: 'content_json' })
  contentJson: {
    day: number;
    title: string;
    passageFromSermon: string;
    reflection: string;
    prayerPrompt: string;
  }[];
}
