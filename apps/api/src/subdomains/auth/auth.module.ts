import { Module } from '@nestjs/common';
import { ApplicationModule } from './application/application.module';
import { ApiModule } from './api/api.module';

@Module({
  imports: [ApplicationModule, ApiModule],
  exports: [ApplicationModule],
})
export class AuthModule {}
