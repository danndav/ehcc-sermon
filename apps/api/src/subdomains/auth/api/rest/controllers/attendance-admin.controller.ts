import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../../../aop/authentication/guards/auth.guard';
import { RolesGuard } from '../../../../../aop/authentication/guards/roles.guard';
import { Roles } from '../../../../../aop/authentication/decorators/roles.decorator';
import { DATA_ROLES, SYSTEM_ROLES, RoleEnum } from '../../../domain/enums/role.enum';
import { AttendanceService } from '../../../application/services/attendance.service';

@ApiTags('Admin — Attendance')
@ApiBearerAuth()
@Controller('admin/attendance')
@UseGuards(AuthGuard, RolesGuard)
@Roles(...DATA_ROLES)
export class AttendanceAdminController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Get()
  @ApiOperation({ summary: 'List all attendance records (paginated)' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: 200, description: 'Paginated attendance records' })
  async listAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.attendanceService.getAllAttendance(+page, +limit);
  }

  @Get('today')
  @ApiOperation({ summary: "Today's attendance count and list" })
  @ApiResponse({ status: 200, description: "Today's attendance" })
  async todayAttendance() {
    return this.attendanceService.getTodayAttendance();
  }

  @Post('clock-in')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Clock in a user (admin must be at church)' })
  async adminClockIn(@Body() body: { userId: number; latitude: number; longitude: number; branchId?: number }) {
    return this.attendanceService.adminClockIn(body.userId, body.latitude, body.longitude, body.branchId);
  }
}
