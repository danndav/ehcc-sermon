import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ApplicationModule } from '../application/application.module';
import { PrayerController } from './rest/controllers/prayer.controller';
import { PrayerAdminController } from './rest/controllers/prayer-admin.controller';
import { checkAuthenticationToken } from '../../../aop/authentication/middleware/check-authentication-token.middleware';
import { createUserContext, createAdminContext, createPublicContext } from '../../../aop/context/context.middleware';

@Module({
  imports: [ApplicationModule],
  controllers: [PrayerController, PrayerAdminController],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(checkAuthenticationToken, createAdminContext)
      .forRoutes(PrayerAdminController);
    consumer
      .apply(createPublicContext)
      .forRoutes(PrayerController);
  }
}
