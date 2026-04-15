import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../../../aop/authentication/guards/auth.guard';
import { RolesGuard } from '../../../../../aop/authentication/guards/roles.guard';
import { Roles } from '../../../../../aop/authentication/decorators/roles.decorator';
import { WORKER_ROLES } from '../../../../auth/domain/enums/role.enum';
import { MinistryGuideService } from '../../../application/services/ministry-guide.service';
import { Request } from 'express';

@ApiTags('Ministry Guide')
@UseGuards(AuthGuard, RolesGuard)
@Roles(...WORKER_ROLES)
@Controller('ministry-guide')
export class MinistryGuideController {
  constructor(private readonly service: MinistryGuideService) {}

  @Get('my-members')
  @ApiOperation({ summary: 'Get members assigned to me with follow-up status' })
  async getMyMembers(@Req() req: Request) {
    const userId = (req as any).context?.currentUser?.id;
    return this.service.getMyMembers(userId);
  }

  @Post('followup')
  @ApiOperation({ summary: 'Log a follow-up for an assigned member' })
  async logFollowup(
    @Body() body: { assignmentId: string; comment: string },
    @Req() req: Request,
  ) {
    const userId = (req as any).context?.currentUser?.id;
    return this.service.logFollowup(userId, body);
  }

  @Get('followup/:assignmentId/history')
  @ApiOperation({ summary: 'Get follow-up history for an assignment' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getHistory(
    @Param('assignmentId') assignmentId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.getFollowupHistory(assignmentId, {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Post('weekly-report')
  @ApiOperation({ summary: 'Submit weekly report' })
  async submitWeeklyReport(
    @Body() body: { report: string; challenges?: string; prayerPoints?: string },
    @Req() req: Request,
  ) {
    const userId = (req as any).context?.currentUser?.id;
    const branchId = (req as any).context?.currentUser?.branchId;
    return this.service.submitWeeklyReport(userId, { ...body, branchId });
  }

  @Get('weekly-report/current')
  @ApiOperation({ summary: 'Get my report for this week' })
  async getMyCurrentReport(@Req() req: Request) {
    const userId = (req as any).context?.currentUser?.id;
    return this.service.getMyWeeklyReport(userId);
  }

  @Get('weekly-report/history')
  @ApiOperation({ summary: 'Get my past weekly reports' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getMyPastReports(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = (req as any).context?.currentUser?.id;
    return this.service.getMyPastReports(userId, {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }
}
