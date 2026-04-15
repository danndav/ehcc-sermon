import { Body, Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../../../aop/authentication/guards/auth.guard';
import { RolesGuard } from '../../../../../aop/authentication/guards/roles.guard';
import { Public } from '../../../../../aop/constants';
import { SermonService } from '../../../application/services/sermon.service';
import { PastorService } from '../../../application/services/pastor.service';
import { SeriesService } from '../../../application/services/series.service';
import { VerseService } from '../../../application/services/verse.service';
import { SermonMetadataService } from '../../../application/services/sermon-metadata.service';
import { WatchHistoryService } from '../../../application/services/watch-history.service';
import { BookmarkService } from '../../../application/services/bookmark.service';
import { UserNoteService } from '../../../application/services/user-note.service';
import { VerseTypeEnum } from '../../../domain/entities/verse.entity';
import { Request } from 'express';

@ApiTags('Sermons')
@UseGuards(AuthGuard, RolesGuard)
@Controller('sermons')
export class SermonController {
  constructor(
    private readonly sermonService: SermonService,
    private readonly pastorService: PastorService,
    private readonly seriesService: SeriesService,
    private readonly verseService: VerseService,
    private readonly metadataService: SermonMetadataService,
    private readonly watchHistoryService: WatchHistoryService,
    private readonly bookmarkService: BookmarkService,
    private readonly userNoteService: UserNoteService,
  ) {}

  // --- Public sermon browsing ---

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get published sermons' })
  @ApiQuery({ name: 'branchId', required: false, type: Number })
  @ApiQuery({ name: 'pastorId', required: false, type: String })
  @ApiQuery({ name: 'seriesId', required: false, type: String })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findSermons(
    @Query('branchId') branchId?: string,
    @Query('pastorId') pastorId?: string,
    @Query('seriesId') seriesId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.sermonService.findPublished({
      branchId: branchId ? Number(branchId) : undefined,
      pastorId: pastorId || undefined,
      seriesId: seriesId || undefined,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  @Public()
  @Get('pastors')
  @ApiOperation({ summary: 'Get pastors' })
  @ApiQuery({ name: 'branchId', required: false, type: Number })
  async findPastors(@Query('branchId') branchId?: string) {
    return this.pastorService.findAll({ branchId: branchId ? Number(branchId) : undefined });
  }

  @Public()
  @Get('series')
  @ApiOperation({ summary: 'Get active series' })
  @ApiQuery({ name: 'branchId', required: false, type: Number })
  async findSeries(@Query('branchId') branchId?: string) {
    return this.seriesService.findActive({ branchId: branchId ? Number(branchId) : undefined });
  }

  @Public()
  @Get('verses/current')
  @ApiOperation({ summary: 'Get current verse of week and year' })
  @ApiQuery({ name: 'branchId', required: false, type: Number })
  async getCurrentVerses(@Query('branchId') branchId?: string) {
    const bid = branchId ? Number(branchId) : undefined;
    const [week, year] = await Promise.all([
      this.verseService.findCurrent(VerseTypeEnum.WEEK, bid),
      this.verseService.findCurrent(VerseTypeEnum.YEAR, bid),
    ]);
    return { verseOfTheWeek: week, verseOfTheYear: year };
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a sermon by ID' })
  async findById(@Param('id') id: string) {
    return this.sermonService.findById(id);
  }

  @Public()
  @Get(':id/transcript')
  @ApiOperation({ summary: 'Get transcript for a sermon' })
  async getTranscript(@Param('id') id: string) {
    return this.metadataService.getTranscript(id);
  }

  @Public()
  @Get(':id/metadata')
  @ApiOperation({ summary: 'Get full metadata for a sermon' })
  async getMetadata(@Param('id') id: string) {
    return this.metadataService.findBySermonId(id);
  }

  // --- Watch history (authenticated) ---

  @Post(':id/view')
  @ApiOperation({ summary: 'Record a unique view for a sermon' })
  async recordView(@Param('id') id: string, @Req() req: Request) {
    const userId = (req as any).context?.currentUser?.id?.toString();
    if (!userId) {
      // Not logged in — don't count
      return { success: false };
    }
    const isNew = await this.sermonService.recordUniqueView(id, userId);
    return { success: true, newView: isNew };
  }

  @Post(':id/progress')
  @ApiOperation({ summary: 'Save watch progress' })
  async saveProgress(
    @Param('id') id: string,
    @Body() body: { progressSeconds: number; completed?: boolean },
    @Req() req: Request,
  ) {
    const userId = (req as any).context?.currentUser?.id?.toString();
    return this.watchHistoryService.saveProgress(userId, id, body.progressSeconds, body.completed || false);
  }

  @Get(':id/progress')
  @ApiOperation({ summary: 'Get watch progress for a sermon' })
  async getProgress(@Param('id') id: string, @Req() req: Request) {
    const userId = (req as any).context?.currentUser?.id?.toString();
    return this.watchHistoryService.getProgress(userId, id);
  }

  @Get('user/history')
  @ApiOperation({ summary: 'Get watch history for current user' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getHistory(@Req() req: Request, @Query('page') page?: string, @Query('limit') limit?: string) {
    const userId = (req as any).context?.currentUser?.id?.toString();
    return this.watchHistoryService.getHistory(userId, {
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    });
  }

  // --- Bookmarks (authenticated) ---

  @Post(':id/bookmark')
  @ApiOperation({ summary: 'Toggle bookmark on a sermon' })
  async toggleBookmark(@Param('id') id: string, @Req() req: Request) {
    const userId = (req as any).context?.currentUser?.id?.toString();
    return this.bookmarkService.toggle(userId, id);
  }

  @Get('user/bookmarks')
  @ApiOperation({ summary: 'Get bookmarked sermons for current user' })
  async getBookmarks(@Req() req: Request) {
    const userId = (req as any).context?.currentUser?.id?.toString();
    return this.bookmarkService.getByUser(userId);
  }

  @Get('user/continue-watching')
  @ApiOperation({ summary: 'Get sermons the user started but did not finish' })
  async getContinueWatching(@Req() req: Request) {
    const userId = (req as any).context?.currentUser?.id?.toString();
    return this.watchHistoryService.getContinueWatching(userId);
  }

  // --- Notes (authenticated) ---

  @Get('user/notes')
  @ApiOperation({ summary: 'Get all notes for current user' })
  async getUserNotes(@Req() req: Request) {
    const userId = (req as any).context?.currentUser?.id?.toString();
    return this.userNoteService.findByUser(userId);
  }

  @Get(':id/notes')
  @ApiOperation({ summary: 'Get notes for a specific sermon' })
  async getSermonNotes(@Param('id') id: string, @Req() req: Request) {
    const userId = (req as any).context?.currentUser?.id?.toString();
    return this.userNoteService.findByUserAndSermon(userId, id);
  }

  @Post(':id/notes')
  @ApiOperation({ summary: 'Create a note on a sermon' })
  async createNote(
    @Param('id') id: string,
    @Body() body: { noteText: string; transcriptTimestamp?: number; highlightedText?: string },
    @Req() req: Request,
  ) {
    const userId = (req as any).context?.currentUser?.id?.toString();
    return this.userNoteService.create(userId, id, body.noteText, body.transcriptTimestamp, body.highlightedText);
  }

  @Delete('notes/:noteId')
  @ApiOperation({ summary: 'Delete a note' })
  async deleteNote(@Param('noteId') noteId: string, @Req() req: Request) {
    const userId = (req as any).context?.currentUser?.id?.toString();
    return this.userNoteService.remove(noteId, userId);
  }
}
