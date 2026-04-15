import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ApplicationModule } from '../application/application.module';
import { MediaAdminController } from './rest/controllers/media-admin.controller';
import { VideoController } from './rest/controllers/video.controller';
import { checkAuthenticationToken } from '../../../aop/authentication/middleware/check-authentication-token.middleware';
import { createAdminContext, createUserContext } from '../../../aop/context/context.middleware';

@Module({
  imports: [ApplicationModule],
  controllers: [MediaAdminController, VideoController],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(checkAuthenticationToken, createAdminContext)
      .forRoutes(MediaAdminController);
    consumer
      .apply(checkAuthenticationToken, createUserContext)
      .forRoutes(VideoController);
  }
}
