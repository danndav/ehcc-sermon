import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../domain/entities/user.entity';
import { Attendance } from '../domain/entities/attendance.entity';
import { UserRepository } from './repositories/user.repository';
import { UserReadRepository } from './repositories/read/user.read-repository';
import { AttendanceRepository } from './repositories/attendance.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, Attendance])],
  providers: [UserRepository, UserReadRepository, AttendanceRepository],
  exports: [UserRepository, UserReadRepository, AttendanceRepository],
})
export class InfrastructureModule {}
