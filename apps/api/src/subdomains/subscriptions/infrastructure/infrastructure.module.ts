import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscription } from '../domain/entities/subscription.entity';
import { SermonPurchase } from '../domain/entities/sermon-purchase.entity';
import { DiscountCode } from '../domain/entities/discount-code.entity';
import { SubscriptionRepository } from './repositories/subscription.repository';
import { SermonPurchaseRepository } from './repositories/sermon-purchase.repository';
import { DiscountCodeRepository } from './repositories/discount-code.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Subscription, SermonPurchase, DiscountCode])],
  providers: [SubscriptionRepository, SermonPurchaseRepository, DiscountCodeRepository],
  exports: [SubscriptionRepository, SermonPurchaseRepository, DiscountCodeRepository],
})
export class InfrastructureModule {}
