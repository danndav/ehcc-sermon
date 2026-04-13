import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ApplicationModule } from '../application/application.module';
import { SubscriptionController } from './rest/controllers/subscription.controller';
import { SubscriptionAdminController } from './rest/controllers/subscription-admin.controller';
import { WebhookController } from './rest/controllers/webhook.controller';
import { checkAuthenticationToken } from '../../../aop/authentication/middleware/check-authentication-token.middleware';
import { createUserContext, createAdminContext } from '../../../aop/context/context.middleware';

@Module({
  imports: [ApplicationModule],
  controllers: [SubscriptionController, SubscriptionAdminController, WebhookController],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(checkAuthenticationToken, createAdminContext)
      .forRoutes(SubscriptionAdminController);
    consumer
      .apply(checkAuthenticationToken, createUserContext)
      .forRoutes(SubscriptionController);
    // WebhookController is public — no auth middleware (uses Paystack signature verification)
  }
}
