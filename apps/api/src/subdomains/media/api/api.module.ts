import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ApplicationModule } from '../application/application.module';
import { MediaAdminController } from './rest/controllers/media-admin.controller';
import { checkAuthenticationToken } from '../../../aop/authentication/middleware/check-authentication-token.middleware';
import { createAdminContext } from '../../../aop/context/context.middleware';

@Module({
  imports: [ApplicationModule],
  controllers: [MediaAdminController],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(checkAuthenticationToken, createAdminContext)
      .forRoutes(MediaAdminController);
  }
}
