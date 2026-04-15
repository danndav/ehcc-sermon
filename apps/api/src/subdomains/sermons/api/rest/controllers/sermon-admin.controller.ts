import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../../../aop/authentication/guards/auth.guard';
import { RolesGuard } from '../../../../../aop/authentication/guards/roles.guard';
import { Roles } from '../../../../../aop/authentication/decorators/roles.decorator';
import { RoleEnum, ADMIN_ROLES, CONTENT_ROLES, DATA_ROLES, SYSTEM_ROLES } from '../../../../auth/domain/enums/role.enum';
import { SermonService } from '../../../application/services/sermon.service';
import { PastorService } from '../../../application/services/pastor.service';
import { SeriesService } from '../../../application/services/series.service';
import { VerseService } from '../../../application/services/verse.service';
import { SermonStatusEnum } from '../../../domain/enums/sermon-status.enum';
import { VerseTypeEnum } from '../../../domain/entities/verse.entity';
import { DataSource } from 'typeorm';

@ApiTags('Admin / Sermons')
@UseGuards(AuthGuard, RolesGuard)
@Roles(...ADMIN_ROLES)
@Controller('admin/sermons')
export class SermonAdminController {
  constructor(
    private readonly sermonService: SermonService,
    private readonly pastorService: PastorService,
    private readonly seriesService: SeriesService,
    private readonly verseService: VerseService,
    private readonly dataSource: DataSource,
  ) {}

  // --- Sermon CRUD ---

  @Get()
  @ApiOperation({ summary: 'List all sermons (admin)' })
  @ApiQuery({ name: 'status', required: false, enum: SermonStatusEnum })
  @ApiQuery({ name: 'branchId', required: false, type: Number })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async listSermons(
    @Query('status') status?: SermonStatusEnum,
    @Query('branchId') branchId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.sermonService.findAll({
      status,
      branchId: branchId ? Number(branchId) : undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a sermon by ID (admin)' })
  async getSermon(@Param('id') id: string) {
    return this.sermonService.findById(id);
  }

  @Post()
  @Roles(...CONTENT_ROLES)
  @ApiOperation({ summary: 'Create a new sermon' })
  async createSermon(
    @Body() body: {
      title: string;
      pastorId?: string;
      seriesId?: string;
      mediaType?: string;
      videoUrl?: string;
      audioUrl?: string;
      youtubeUrl?: string;
      thumbnailUrl?: string;
      isFree?: boolean;
      duration?: number;
      programmeType?: string;
      specialProgrammeName?: string;
      threeDgDay?: number;
      programmeSession?: string;
      branchId?: number;
      status?: string;
      autoPublish?: boolean;
    },
  ) {
    return this.sermonService.create({
      title: body.title,
      pastorId: body.pastorId || null,
      seriesId: body.seriesId || null,
      mediaType: body.mediaType as any,
      videoUrl: body.videoUrl || null,
      audioUrl: body.audioUrl || null,
      youtubeUrl: body.youtubeUrl || null,
      thumbnailUrl: body.thumbnailUrl || null,
      isFree: body.isFree ?? true,
      duration: body.duration || null,
      programmeType: body.programmeType as any,
      specialProgrammeName: body.specialProgrammeName || null,
      threeDgDay: body.threeDgDay || null,
      programmeSession: body.programmeSession as any || null,
      branchId: body.branchId || null,
      status: (body.status as any) || SermonStatusEnum.DRAFT,
      autoPublish: body.autoPublish || false,
    });
  }

  @Patch(':id')
  @Roles(...CONTENT_ROLES)
  @ApiOperation({ summary: 'Update a sermon' })
  async updateSermon(@Param('id') id: string, @Body() body: Record<string, any>) {
    return this.sermonService.update(id, body);
  }

  @Post(':id/publish')
  @Roles(...CONTENT_ROLES)
  @ApiOperation({ summary: 'Publish a sermon' })
  async publishSermon(@Param('id') id: string) {
    return this.sermonService.publish(id);
  }

  @Post(':id/unpublish')
  @Roles(...CONTENT_ROLES)
  @ApiOperation({ summary: 'Unpublish a sermon (back to draft)' })
  async unpublishSermon(@Param('id') id: string) {
    return this.sermonService.unpublish(id);
  }

  @Delete(':id')
  @Roles(RoleEnum.SUPER_ADMIN, RoleEnum.ADMIN)
  @ApiOperation({ summary: 'Delete a sermon' })
  async deleteSermon(@Param('id') id: string) {
    await this.sermonService.remove(id);
    return { deleted: true };
  }

  // --- Pastor CRUD ---

  @Get('pastors/all')
  @ApiOperation({ summary: 'List all pastors (admin)' })
  async listPastors(@Query('branchId') branchId?: string) {
    return this.pastorService.findAll({ branchId: branchId ? Number(branchId) : undefined });
  }

  @Post('pastors')
  @ApiOperation({ summary: 'Create a pastor' })
  async createPastor(@Body() body: { name: string; bio?: string; photoUrl?: string; churchRole?: string; branchId?: number }) {
    return this.pastorService.create(body);
  }

  @Patch('pastors/:id')
  @ApiOperation({ summary: 'Update a pastor' })
  async updatePastor(@Param('id') id: string, @Body() body: Record<string, any>) {
    return this.pastorService.update(id, body);
  }

  @Delete('pastors/:id')
  @ApiOperation({ summary: 'Delete a pastor' })
  async deletePastor(@Param('id') id: string) {
    await this.pastorService.remove(id);
    return { deleted: true };
  }

  // --- Series CRUD ---

  @Get('series/all')
  @ApiOperation({ summary: 'List all series (admin)' })
  async listSeries(@Query('branchId') branchId?: string) {
    return this.seriesService.findAll({ branchId: branchId ? Number(branchId) : undefined });
  }

  @Post('series')
  @ApiOperation({ summary: 'Create a series' })
  async createSeries(@Body() body: { title: string; description?: string; thumbnailUrl?: string; branchId?: number }) {
    return this.seriesService.create(body);
  }

  @Patch('series/:id')
  @ApiOperation({ summary: 'Update a series' })
  async updateSeries(@Param('id') id: string, @Body() body: Record<string, any>) {
    return this.seriesService.update(id, body);
  }

  @Delete('series/:id')
  @ApiOperation({ summary: 'Delete a series' })
  async deleteSeries(@Param('id') id: string) {
    await this.seriesService.remove(id);
    return { deleted: true };
  }

  // --- Analytics ---

  @Get('analytics/overview')
  @ApiOperation({ summary: 'Get total views, unique viewers, and top sermons' })
  async getAnalyticsOverview() {
    const [totalViews] = await this.dataSource.query(`SELECT COALESCE(SUM(view_count), 0) as total FROM sermons WHERE deleted_at IS NULL`);
    const [uniqueViewers] = await this.dataSource.query(`SELECT COUNT(DISTINCT user_id) as total FROM watch_history WHERE deleted_at IS NULL`);
    const [totalSermons] = await this.dataSource.query(`SELECT COUNT(*) as total FROM sermons WHERE deleted_at IS NULL`);
    const [publishedSermons] = await this.dataSource.query(`SELECT COUNT(*) as total FROM sermons WHERE status = 'published' AND deleted_at IS NULL`);
    const topSermons = await this.dataSource.query(`
      SELECT s.id, s.title, s.view_count as "viewCount", s.programme_type as "programmeType",
             s.published_at as "publishedAt", p.name as "pastorName"
      FROM sermons s LEFT JOIN pastors p ON p.id = s.pastor_id
      WHERE s.deleted_at IS NULL ORDER BY s.view_count DESC LIMIT 10
    `);

    return {
      totalViews: Number(totalViews.total),
      uniqueViewers: Number(uniqueViewers.total),
      totalSermons: Number(totalSermons.total),
      publishedSermons: Number(publishedSermons.total),
      topSermons,
    };
  }

  @Get('analytics/:sermonId/viewers')
  @ApiOperation({ summary: 'Get list of viewers for a specific sermon with EA numbers' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getSermonViewers(
    @Param('sermonId') sermonId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '50',
  ) {
    const offset = (Number(page) - 1) * Number(limit);
    const viewers = await this.dataSource.query(`
      SELECT
        u.id as "userId", u.ea_number as "eaNumber", u.name, u.branch_id as "branchId",
        wh.progress_seconds as "progressSeconds", wh.completed,
        wh.last_watched_at as "lastWatchedAt", wh.created_at as "firstWatchedAt"
      FROM watch_history wh
      JOIN users u ON u.id = CAST(wh.user_id AS integer)
      WHERE wh.sermon_id = $1 AND wh.deleted_at IS NULL
      ORDER BY wh.last_watched_at DESC
      LIMIT $2 OFFSET $3
    `, [sermonId, Number(limit), offset]);

    const [countResult] = await this.dataSource.query(`
      SELECT COUNT(*) as total FROM watch_history WHERE sermon_id = $1 AND deleted_at IS NULL
    `, [sermonId]);

    return { viewers, total: Number(countResult.total) };
  }

  @Get('analytics/recent-activity')
  @ApiOperation({ summary: 'Get recent watch activity across all sermons' })
  async getRecentActivity() {
    const activity = await this.dataSource.query(`
      SELECT
        u.ea_number as "eaNumber", u.name as "userName",
        s.title as "sermonTitle", s.id as "sermonId",
        wh.progress_seconds as "progressSeconds", wh.completed,
        wh.last_watched_at as "watchedAt"
      FROM watch_history wh
      JOIN users u ON u.id = CAST(wh.user_id AS integer)
      JOIN sermons s ON s.id = wh.sermon_id
      WHERE wh.deleted_at IS NULL
      ORDER BY wh.last_watched_at DESC
      LIMIT 50
    `);
    return activity;
  }

  // --- Verse Management ---

  @Get('verses')
  @ApiOperation({ summary: 'Get all verses (admin)' })
  @ApiQuery({ name: 'type', required: false, enum: VerseTypeEnum })
  async getVerses(@Query('type') type?: VerseTypeEnum) {
    return this.verseService.findAll(type);
  }

  @Post('verses')
  @ApiOperation({ summary: 'Create a new verse' })
  async createVerse(@Body() body: { type: VerseTypeEnum; scripture: string; reference: string; translation?: string; branchId?: number; startDate: string; endDate?: string; setBy?: string }) {
    return this.verseService.create({ ...body, translation: body.translation || null, branchId: body.branchId || null, endDate: body.endDate || null, setBy: body.setBy || null, isActive: true });
  }

  @Patch('verses/:id')
  @ApiOperation({ summary: 'Update a verse' })
  async updateVerse(@Param('id') id: string, @Body() body: Record<string, any>) {
    return this.verseService.update(id, body);
  }

  @Delete('verses/:id')
  @ApiOperation({ summary: 'Delete a verse' })
  async deleteVerse(@Param('id') id: string) {
    await this.verseService.remove(id);
    return { deleted: true };
  }
}
