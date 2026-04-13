import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ApplicationModule } from '../application/application.module';
import { AuthenticationModule } from '../../../aop/authentication/authentication.module';
import { NotificationController } from './rest/controllers/notification.controller';
import { checkAuthenticationToken } from '../../../aop/authentication/middleware/check-authentication-token.middleware';
import { createUserContext } from '../../../aop/context/context.middleware';

@Module({
  imports: [ApplicationModule, AuthenticationModule],
  controllers: [NotificationController],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(checkAuthenticationToken, createUserContext)
      .forRoutes(NotificationController);
  }
}
