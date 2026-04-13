import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ApplicationModule } from '../application/application.module';
import { AiController } from './rest/controllers/ai.controller';
import { checkAuthenticationToken } from '../../../aop/authentication/middleware/check-authentication-token.middleware';
import { createUserContext } from '../../../aop/context/context.middleware';

@Module({
  imports: [ApplicationModule],
  controllers: [AiController],
})
export class ApiModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(checkAuthenticationToken, createUserContext)
      .forRoutes(AiController);
  }
}
