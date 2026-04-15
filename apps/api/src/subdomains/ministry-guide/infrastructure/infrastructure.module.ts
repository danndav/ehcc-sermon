import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MinistryAssignment } from '../domain/entities/ministry-assignment.entity';
import { MinistryFollowupLog } from '../domain/entities/ministry-followup-log.entity';
import { MinistryWeeklyReport } from '../domain/entities/ministry-weekly-report.entity';
import { MinistryAssignmentRepository } from './repositories/ministry-assignment.repository';
import { MinistryFollowupLogRepository } from './repositories/ministry-followup-log.repository';
import { MinistryWeeklyReportRepository } from './repositories/ministry-weekly-report.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MinistryAssignment, MinistryFollowupLog, MinistryWeeklyReport])],
  providers: [MinistryAssignmentRepository, MinistryFollowupLogRepository, MinistryWeeklyReportRepository],
  exports: [MinistryAssignmentRepository, MinistryFollowupLogRepository, MinistryWeeklyReportRepository],
})
export class InfrastructureModule {}
