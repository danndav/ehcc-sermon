import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { AuthService } from './services/auth.service';
import { IamService } from './services/iam.service';
import { UserAdminService } from './services/user-admin.service';

@Module({
  imports: [InfrastructureModule],
  providers: [AuthService, IamService, UserAdminService],
  exports: [AuthService, IamService, UserAdminService],
})
export class ApplicationModule {}
