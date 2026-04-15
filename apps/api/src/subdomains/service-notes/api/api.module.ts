import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ApplicationModule } from '../application/application.module';
import { ServiceNoteController } from './rest/controllers/service-note.controller';
import { ServiceNoteAdminController } from './rest/controllers/service-note-admin.controller';
import { checkAuthenticationToken } from '../../../aop/authentication/middleware/check-authentication-token.middleware';
import { createUserContext, createAdminContext } from '../../../aop/context/context.middleware';

@Module({
  imports: [ApplicationModule],
  controllers: [ServiceNoteController, ServiceNoteAdminController],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(checkAuthenticationToken, createAdminContext)
      .forRoutes(ServiceNoteAdminController);
    consumer
      .apply(checkAuthenticationToken, createUserContext)
      .forRoutes(ServiceNoteController);
  }
}
