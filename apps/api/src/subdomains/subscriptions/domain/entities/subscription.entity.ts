import { Column, Entity } from 'typeorm';
import { IEntity } from '../../../../aop/db/entities/entity';
import { SubscriptionStatusEnum } from '../enums/subscription-status.enum';
import { SubscriptionTierEnum } from '../enums/subscription-tier.enum';

@Entity('subscriptions')
export class Subscription extends IEntity {
  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'enum', enum: SubscriptionTierEnum })
  planTier: SubscriptionTierEnum;

  @Column({ type: 'enum', enum: SubscriptionStatusEnum, default: SubscriptionStatusEnum.ACTIVE })
  status: SubscriptionStatusEnum;

  @Column({ type: 'varchar', nullable: true, name: 'paystack_ref' })
  paystackRef: string | null;

  @Column({ type: 'varchar', nullable: true, name: 'paystack_subscription_code' })
  paystackSubscriptionCode: string | null;

  @Column({ type: 'timestamp', name: 'starts_at' })
  startsAt: Date;

  @Column({ type: 'timestamp', name: 'ends_at' })
  endsAt: Date;
}
