import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ApplicationModule } from '../application/application.module';
import { SermonController } from './rest/controllers/sermon.controller';
import { SermonAdminController } from './rest/controllers/sermon-admin.controller';
import { checkAuthenticationToken } from '../../../aop/authentication/middleware/check-authentication-token.middleware';
import { createUserContext, createAdminContext, createPublicContext } from '../../../aop/context/context.middleware';

@Module({
  imports: [ApplicationModule],
  controllers: [SermonController, SermonAdminController],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(checkAuthenticationToken, createAdminContext)
      .forRoutes(SermonAdminController);
    consumer
      .apply(checkAuthenticationToken, createUserContext)
      .forRoutes(SermonController);
  }
}
