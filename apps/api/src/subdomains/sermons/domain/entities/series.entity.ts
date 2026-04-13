import { Column, Entity } from 'typeorm';
import { IEntity } from '../../../../aop/db/entities/entity';

@Entity('series')
export class Series extends IEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ type: 'varchar', nullable: true, name: 'thumbnail_url' })
  thumbnailUrl: string | null;

  @Column({ type: 'boolean', default: true, name: 'is_active' })
  isActive: boolean;
}
