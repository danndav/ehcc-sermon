import { Module } from '@nestjs/common';

import { AuthModule } from '../../subdomains/auth/auth.module';
import { ProcessAdminRequestMiddleware } from './middleware/process-admin-request.middleware';
import { ProcessCustomerRequestMiddleware } from './middleware/process-token.middleware';

@Module({
  exports: [ProcessCustomerRequestMiddleware, ProcessAdminRequestMiddleware, AuthModule],
  imports: [AuthModule],
  providers: [ProcessCustomerRequestMiddleware, ProcessAdminRequestMiddleware],
})
export class AuthenticationModule {}
