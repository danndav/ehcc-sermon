import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { SubscriptionService } from './services/subscription.service';
import { PaystackService } from './services/paystack.service';

@Module({
  imports: [InfrastructureModule],
  providers: [SubscriptionService, PaystackService],
  exports: [SubscriptionService, PaystackService],
})
export class ApplicationModule {}
