import { Column, Entity } from 'typeorm';
import { IEntity } from '../../../../aop/db/entities/entity';

@Entity('sermon_purchases')
export class SermonPurchase extends IEntity {
  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'uuid', name: 'sermon_id' })
  sermonId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', nullable: true, name: 'paystack_ref' })
  paystackRef: string | null;

  @Column({ type: 'timestamp', name: 'purchased_at' })
  purchasedAt: Date;
}
