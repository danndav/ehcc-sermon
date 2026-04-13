import { Column, Entity } from 'typeorm';
import { IEntity } from '../../../../aop/db/entities/entity';

@Entity('prayer_agreements')
export class PrayerAgreement extends IEntity {
  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'uuid', name: 'prayer_request_id' })
  prayerRequestId: string;
}
