import { Controller, Delete, Get, Param, Query, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AuthGuard } from '../../../../../aop/authentication/guards/auth.guard';
import { RolesGuard } from '../../../../../aop/authentication/guards/roles.guard';
import { Roles } from '../../../../../aop/authentication/decorators/roles.decorator';
import { ADMIN_ROLES } from '../../../../auth/domain/enums/role.enum';
import { ServiceNoteService } from '../../../application/services/service-note.service';
import { NoteProgrammeTypeEnum } from '../../../domain/enums/note-programme-type.enum';

@ApiTags('Admin / Service Notes')
@UseGuards(AuthGuard, RolesGuard)
@Roles(...ADMIN_ROLES)
@Controller('admin/service-notes')
export class ServiceNoteAdminController {
  constructor(private readonly service: ServiceNoteService) {}

  @Get()
  @ApiOperation({ summary: 'List all submissions (paginated, filterable)' })
  @ApiQuery({ name: 'programmeType', required: false, enum: NoteProgrammeTypeEnum })
  @ApiQuery({ name: 'branchId', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async listAll(
    @Query('programmeType') programmeType?: NoteProgrammeTypeEnum,
    @Query('branchId') branchId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.service.findAll({
      programmeType,
      branchId: branchId ? Number(branchId) : undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get('weekly-report')
  @ApiOperation({ summary: 'Get weekly compliance report' })
  @ApiQuery({ name: 'weekStart', required: false, description: 'Start date YYYY-MM-DD (defaults to current week)' })
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

  @Get('missing')
  @ApiOperation({ summary: 'Get workers who haven\'t submitted' })
  @ApiQuery({ name: 'weekStart', required: false })
  @ApiQuery({ name: 'branchId', required: false, type: Number })
  async getMissing(
    @Query('weekStart') weekStart?: string,
    @Query('branchId') branchId?: string,
  ) {
    return this.service.getMissingSubmissions({
      weekStart,
      branchId: branchId ? Number(branchId) : undefined,
    });
  }

  @Get('export/csv')
  @ApiOperation({ summary: 'Export weekly report as CSV' })
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
    res!.setHeader('Content-Disposition', `attachment; filename="service-notes-report.csv"`);
    res!.send(csv);
  }

  @Get(':id')
  @ApiOperation({ summary: 'View a submission' })
  async getById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a submission' })
  async deleteSubmission(@Param('id') id: string) {
    await this.service.adminDelete(id);
    return { deleted: true };
  }
}
