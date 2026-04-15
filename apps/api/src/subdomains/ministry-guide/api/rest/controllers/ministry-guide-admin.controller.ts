import { Body, Controller, Delete, Get, Param, Post, Query, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthGuard } from '../../../../../aop/authentication/guards/auth.guard';
import { RolesGuard } from '../../../../../aop/authentication/guards/roles.guard';
import { Roles } from '../../../../../aop/authentication/decorators/roles.decorator';
import { RoleEnum } from '../../../../auth/domain/enums/role.enum';
import { MinistryGuideService } from '../../../application/services/ministry-guide.service';

@ApiTags('Admin / Ministry Guide')
@UseGuards(AuthGuard, RolesGuard)
@Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
@Controller('admin/ministry-guide')
export class MinistryGuideAdminController {
  constructor(private readonly service: MinistryGuideService) {}

  @Post('assign')
  @ApiOperation({ summary: 'Assign a member to a leader' })
  async createAssignment(@Body() body: { leaderId: number; memberId: number; branchId?: number; notes?: string }) {
    return this.service.createAssignment(body);
  }

  @Post('bulk-assign')
  @ApiOperation({ summary: 'Assign multiple members to a leader' })
  async bulkAssign(@Body() body: { leaderId: number; memberIds: number[]; branchId?: number }) {
    return this.service.bulkAssign(body);
  }

  @Get('assignments')
  @ApiOperation({ summary: 'List all assignments' })
  @ApiQuery({ name: 'branchId', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async listAssignments(
    @Query('branchId') branchId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.listAssignments({
      branchId: branchId ? Number(branchId) : undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Delete('assignments/:id')
  @ApiOperation({ summary: 'Remove an assignment' })
  async removeAssignment(@Param('id') id: string) {
    await this.service.removeAssignment(id);
    return { deleted: true };
  }

  @Post('assignments/:id/deactivate')
  @ApiOperation({ summary: 'Deactivate an assignment (keep history)' })
  async deactivateAssignment(@Param('id') id: string) {
    return this.service.deactivateAssignment(id);
  }

  @Get('weekly-report')
  @ApiOperation({ summary: 'Weekly follow-up compliance report' })
  @ApiQuery({ name: 'weekStart', required: false })
  @ApiQuery({ name: 'branchId', required: false, type: Number })
  async weeklyReport(
    @Query('weekStart') weekStart?: string,
    @Query('branchId') branchId?: string,
  ) {
    return this.service.getWeeklyReport({
      weekStart,
      branchId: branchId ? Number(branchId) : undefined,
    });
  }

  @Get('not-followed-up')
  @ApiOperation({ summary: 'Leaders who haven\'t followed up this week' })
  @ApiQuery({ name: 'weekStart', required: false })
  @ApiQuery({ name: 'branchId', required: false, type: Number })
  async notFollowedUp(
    @Query('weekStart') weekStart?: string,
    @Query('branchId') branchId?: string,
  ) {
    return this.service.getLeadersNotFollowedUp({
      weekStart,
      branchId: branchId ? Number(branchId) : undefined,
    });
  }

  @Get('export/csv')
  @ApiOperation({ summary: 'Export weekly follow-up report as CSV' })
  @ApiQuery({ name: 'weekStart', required: false })
  @ApiQuery({ name: 'branchId', required: false, type: Number })
  async exportCsv(
    @Query('weekStart') weekStart?: string,
    @Query('branchId') branchId?: string,
    @Res() res?: Response,
  ) {
    const csv = await this.service.exportCsv({
      weekStart,
      branchId: branchId ? Number(branchId) : undefined,
    });
    res!.setHeader('Content-Type', 'text/csv');
    res!.setHeader('Content-Disposition', `attachment; filename="ministry-guide-report.csv"`);
    res!.send(csv);
  }

  @Get('leader-reports')
  @ApiOperation({ summary: 'View submitted weekly reports from leaders' })
  @ApiQuery({ name: 'weekStart', required: false })
  async getLeaderReports(@Query('weekStart') weekStart?: string) {
    return this.service.getWeeklyReports({ weekStart });
  }

  @Get('leader-reports/missing')
  @ApiOperation({ summary: 'Leaders who haven\'t submitted their weekly report' })
  @ApiQuery({ name: 'weekStart', required: false })
  @ApiQuery({ name: 'branchId', required: false, type: Number })
  async getLeadersWithoutReport(
    @Query('weekStart') weekStart?: string,
    @Query('branchId') branchId?: string,
  ) {
    return this.service.getLeadersWithoutReport({
      weekStart,
      branchId: branchId ? Number(branchId) : undefined,
    });
  }
}
