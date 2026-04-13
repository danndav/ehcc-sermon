import { Column, Entity } from 'typeorm';
import { IEntity } from '../../../../aop/db/entities/entity';
import { PrayerCategoryEnum } from '../enums/prayer-category.enum';

@Entity('prayer_requests')
export class PrayerRequest extends IEntity {
  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'enum', enum: PrayerCategoryEnum, default: PrayerCategoryEnum.ALL })
  category: PrayerCategoryEnum;

  @Column({ type: 'boolean', default: true, name: 'is_public' })
  isPublic: boolean;

  @Column({ type: 'int', default: 0, name: 'prayer_count' })
  prayerCount: number;
}
