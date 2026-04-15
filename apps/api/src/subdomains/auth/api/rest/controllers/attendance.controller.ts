import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../../../aop/authentication/guards/auth.guard';
import { AttendanceService } from '../../../application/services/attendance.service';

@ApiTags('Attendance')
@ApiBearerAuth()
@Controller('attendance')
@UseGuards(AuthGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  @Post('clock-in')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Clock in at church (geofence validated)' })
  @ApiResponse({ status: 201, description: 'Clocked in successfully' })
  @ApiResponse({ status: 400, description: 'Already clocked in today or not at church' })
  async clockIn(@Request() req: any, @Body() body: { latitude: number; longitude: number }) {
    const userId = req.currentUser.sub;
    return this.attendanceService.clockIn(userId, body.latitude, body.longitude);
  }

  @Post('clock-out')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Clock out (only available from 1:00 PM WAT)' })
  @ApiResponse({ status: 200, description: 'Clocked out successfully' })
  @ApiResponse({ status: 400, description: 'Not clocked in, already clocked out, or before 1 PM' })
  async clockOut(@Request() req: any) {
    const userId = req.currentUser.sub;
    return this.attendanceService.clockOut(userId);
  }

  @Get('today')
  @ApiOperation({ summary: 'Check if current user clocked in/out today' })
  @ApiResponse({ status: 200, description: 'Today status' })
  async todayStatus(@Request() req: any) {
    const userId = req.currentUser.sub;
    return this.attendanceService.getTodayStatus(userId);
  }

  @Get('history')
  @ApiOperation({ summary: 'Get attendance history for current user' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiResponse({ status: 200, description: 'Paginated attendance history' })
  async history(@Request() req: any, @Query('page') page = 1, @Query('limit') limit = 20) {
    const userId = req.currentUser.sub;
    return this.attendanceService.getHistory(userId, +page, +limit);
  }
}
