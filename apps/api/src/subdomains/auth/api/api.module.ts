import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ApplicationModule } from '../application/application.module';
import { AuthController } from './rest/controllers/auth.controller';
import { UserAdminController } from './rest/controllers/user-admin.controller';
import { AttendanceController } from './rest/controllers/attendance.controller';
import { AttendanceAdminController } from './rest/controllers/attendance-admin.controller';
import { checkAuthenticationToken } from '../../../aop/authentication/middleware/check-authentication-token.middleware';
import { createAdminContext, createUserContext } from '../../../aop/context/context.middleware';

@Module({
  imports: [ApplicationModule],
  controllers: [AuthController, UserAdminController, AttendanceController, AttendanceAdminController],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(checkAuthenticationToken, createAdminContext)
      .forRoutes(UserAdminController, AttendanceAdminController);
    consumer
      .apply(checkAuthenticationToken, createUserContext)
      .forRoutes(AttendanceController);
  }
}
