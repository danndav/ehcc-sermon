import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../../../aop/authentication/guards/auth.guard';
import { RolesGuard } from '../../../../../aop/authentication/guards/roles.guard';
import { Roles } from '../../../../../aop/authentication/decorators/roles.decorator';
import { RoleEnum } from '../../../../auth/domain/enums/role.enum';
import { ADMIN_ROLES } from '../../../../auth/domain/enums/role.enum';
import { PrayerRequestService } from '../../../application/services/prayer-request.service';
import { PrayerRecordingService } from '../../../application/services/prayer-recording.service';
import { PrayerSettingsService } from '../../../application/services/prayer-settings.service';
import { PrayerLogService } from '../../../application/services/prayer-log.service';

@ApiTags('Admin / Prayer')
@UseGuards(AuthGuard, RolesGuard)
@Roles(...ADMIN_ROLES)
@Controller('admin/prayer')
export class PrayerAdminController {
  constructor(
    private readonly prayerRequestService: PrayerRequestService,
    private readonly prayerRecordingService: PrayerRecordingService,
    private readonly prayerSettingsService: PrayerSettingsService,
    private readonly prayerLogService: PrayerLogService,
  ) {}

  // --- Prayer Requests ---

  @Get('requests')
  @ApiOperation({ summary: 'List all prayer requests (admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async listRequests(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.prayerRequestService.getAllRequests(
      page ? Number(page) : undefined,
      limit ? Number(limit) : undefined,
    );
  }

  @Get('requests/private')
  @ApiOperation({ summary: 'List private prayer requests (admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async listPrivateRequests(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.prayerRequestService.getPrivateRequests(
      page ? Number(page) : undefined,
      limit ? Number(limit) : undefined,
    );
  }

  @Patch('requests/:id')
  @ApiOperation({ summary: 'Update a prayer request (admin)' })
  async updateRequest(@Param('id') id: string, @Body() body: Record<string, any>) {
    return this.prayerRequestService.update(id, body);
  }

  @Delete('requests/:id')
  @ApiOperation({ summary: 'Delete a prayer request (admin)' })
  async deleteRequest(@Param('id') id: string) {
    await this.prayerRequestService.remove(id);
    return { deleted: true };
  }

  // --- Prayer Recordings ---

  @Get('recordings')
  @ApiOperation({ summary: 'List prayer recordings (admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async listRecordings(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.prayerRecordingService.findAll(
      page ? Number(page) : undefined,
      limit ? Number(limit) : undefined,
    );
  }

  @Post('recordings')
  @ApiOperation({ summary: 'Create a prayer recording' })
  async createRecording(
    @Body() body: {
      title: string;
      ledBy?: string;
      videoUrl?: string;
      audioUrl?: string;
      duration?: number;
      transcript?: string;
      recordedAt?: string;
    },
  ) {
    return this.prayerRecordingService.create({
      title: body.title,
      ledBy: body.ledBy || null,
      videoUrl: body.videoUrl || null,
      audioUrl: body.audioUrl || null,
      duration: body.duration || null,
      transcript: body.transcript || null,
      recordedAt: body.recordedAt ? new Date(body.recordedAt) : null,
    });
  }

  @Delete('recordings/:id')
  @ApiOperation({ summary: 'Delete a prayer recording' })
  async deleteRecording(@Param('id') id: string) {
    await this.prayerRecordingService.remove(id);
    return { deleted: true };
  }

  // --- Prayer Settings ---

  @Get('settings')
  @ApiOperation({ summary: 'Get prayer settings (admin)' })
  async getSettings() {
    return this.prayerSettingsService.getSettings();
  }

  @Patch('settings')
  @ApiOperation({ summary: 'Update prayer settings' })
  async updateSettings(@Body() body: { teamsLink?: string; meetingTime?: string }) {
    return this.prayerSettingsService.updateSettings(body.teamsLink, body.meetingTime);
  }

  // --- Prayer Logs (admin view) ---

  @Get('logs')
  @ApiOperation({ summary: 'Get all prayer logs (admin)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getAllPrayerLogs(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.prayerLogService.getAllLogs(page ? Number(page) : undefined, limit ? Number(limit) : undefined);
  }
}
