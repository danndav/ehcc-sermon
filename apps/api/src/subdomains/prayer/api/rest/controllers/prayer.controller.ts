import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../../../aop/authentication/guards/auth.guard';
import { RolesGuard } from '../../../../../aop/authentication/guards/roles.guard';
import { Public } from '../../../../../aop/constants';
import { PrayerRequestService } from '../../../application/services/prayer-request.service';
import { PrayerRecordingService } from '../../../application/services/prayer-recording.service';
import { PrayerSettingsService } from '../../../application/services/prayer-settings.service';
import { PrayerLogService } from '../../../application/services/prayer-log.service';
import { PrayerCategoryEnum } from '../../../domain/enums/prayer-category.enum';
import { Request } from 'express';

@ApiTags('Prayer')
@UseGuards(AuthGuard, RolesGuard)
@Controller('prayer')
export class PrayerController {
  constructor(
    private readonly prayerRequestService: PrayerRequestService,
    private readonly prayerRecordingService: PrayerRecordingService,
    private readonly prayerSettingsService: PrayerSettingsService,
    private readonly prayerLogService: PrayerLogService,
  ) {}

  @Public()
  @Get('wall')
  @ApiOperation({ summary: 'Get public prayer wall' })
  @ApiQuery({ name: 'category', required: false, enum: PrayerCategoryEnum })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getWall(
    @Query('category') category?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.prayerRequestService.getPublicWall(
      category,
      page ? Number(page) : undefined,
      limit ? Number(limit) : undefined,
    );
  }

  @Get('my-requests')
  @ApiOperation({ summary: 'Get my prayer requests' })
  async getMyRequests(@Req() req: Request) {
    const userId = (req as any).context?.currentUser?.id?.toString();
    return this.prayerRequestService.getMyRequests(userId);
  }

  @Post('request')
  @ApiOperation({ summary: 'Create a prayer request' })
  async createRequest(
    @Body() body: { content: string; category: PrayerCategoryEnum; isPublic?: boolean },
    @Req() req: Request,
  ) {
    const userId = (req as any).context?.currentUser?.id?.toString();
    return this.prayerRequestService.create(
      userId,
      body.content,
      body.category,
      body.isPublic !== undefined ? body.isPublic : true,
    );
  }

  @Post(':id/pray')
  @ApiOperation({ summary: 'Pray for a request (agree in prayer)' })
  async prayFor(@Param('id') id: string, @Req() req: Request) {
    const userId = (req as any).context?.currentUser?.id?.toString();
    return this.prayerRequestService.prayFor(userId, id);
  }

  @Public()
  @Get('recordings')
  @ApiOperation({ summary: 'List prayer recordings' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getRecordings(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.prayerRecordingService.findAll(
      page ? Number(page) : undefined,
      limit ? Number(limit) : undefined,
    );
  }

  @Public()
  @Get('settings')
  @ApiOperation({ summary: 'Get nightly prayer settings' })
  async getSettings() {
    return this.prayerSettingsService.getSettings();
  }

  // --- Prayer Logs ---

  @Post('logs')
  @ApiOperation({ summary: 'Submit prayer time logs (one or more start/end time slots)' })
  async submitPrayerLogs(
    @Body() body: { prayerLogs: { startTime: string; endTime: string }[] },
    @Req() req: Request,
  ) {
    const userId = Number((req as any).context?.currentUser?.id || (req as any).currentUser?.sub);
    return this.prayerLogService.submitLogs(userId, body.prayerLogs);
  }

  @Get('logs/today')
  @ApiOperation({ summary: 'Get my prayer logs for today' })
  async getTodayLogs(@Req() req: Request) {
    const userId = Number((req as any).context?.currentUser?.id || (req as any).currentUser?.sub);
    return this.prayerLogService.getTodayLogs(userId);
  }

  @Get('logs/history')
  @ApiOperation({ summary: 'Get my prayer log history' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getPrayerLogHistory(
    @Req() req: Request,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const userId = Number((req as any).context?.currentUser?.id || (req as any).currentUser?.sub);
    return this.prayerLogService.getHistory(userId, page ? Number(page) : undefined, limit ? Number(limit) : undefined);
  }

  @Get('logs/total')
  @ApiOperation({ summary: 'Get total prayer minutes for current user' })
  async getTotalPrayerMinutes(@Req() req: Request) {
    const userId = Number((req as any).context?.currentUser?.id || (req as any).currentUser?.sub);
    const totalMinutes = await this.prayerLogService.getTotalMinutes(userId);
    return { totalMinutes, totalHours: Math.round(totalMinutes / 60 * 10) / 10 };
  }
}
