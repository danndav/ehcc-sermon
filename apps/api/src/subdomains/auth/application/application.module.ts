import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { AuthService } from './services/auth.service';
import { IamService } from './services/iam.service';
import { UserAdminService } from './services/user-admin.service';
import { AttendanceService } from './services/attendance.service';

@Module({
  imports: [InfrastructureModule],
  providers: [AuthService, IamService, UserAdminService, AttendanceService],
  exports: [AuthService, IamService, UserAdminService, AttendanceService],
})
export class ApplicationModule {}
