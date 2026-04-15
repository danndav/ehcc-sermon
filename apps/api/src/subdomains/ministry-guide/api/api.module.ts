import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ApplicationModule } from '../application/application.module';
import { MinistryGuideController } from './rest/controllers/ministry-guide.controller';
import { MinistryGuideAdminController } from './rest/controllers/ministry-guide-admin.controller';
import { checkAuthenticationToken } from '../../../aop/authentication/middleware/check-authentication-token.middleware';
import { createUserContext, createAdminContext } from '../../../aop/context/context.middleware';

@Module({
  imports: [ApplicationModule],
  controllers: [MinistryGuideController, MinistryGuideAdminController],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(checkAuthenticationToken, createAdminContext)
      .forRoutes(MinistryGuideAdminController);
    consumer
      .apply(checkAuthenticationToken, createUserContext)
      .forRoutes(MinistryGuideController);
  }
}
