import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../../../../aop/authentication/guards/auth.guard';
import { RolesGuard } from '../../../../../aop/authentication/guards/roles.guard';
import { Public } from '../../../../../aop/constants';
import { GuidanceService } from '../../../application/services/guidance.service';
import { EmbeddingService } from '../../../application/services/embedding.service';
import { AutoTaggingService } from '../../../application/services/auto-tagging.service';
import { DevotionalService } from '../../../application/services/devotional.service';
import { Request } from 'express';

@ApiTags('AI')
@UseGuards(AuthGuard, RolesGuard)
@Controller('ai')
export class AiController {
  constructor(
    private readonly guidanceService: GuidanceService,
    private readonly embeddingService: EmbeddingService,
    private readonly autoTaggingService: AutoTaggingService,
    private readonly devotionalService: DevotionalService,
  ) {}

  @Post('guidance')
  @ApiOperation({ summary: 'Get AI sermon recommendations based on what user is going through' })
  async getGuidance(@Body('message') message: string) {
    return this.guidanceService.getGuidance(message);
  }

  @Public()
  @Get('search')
  @ApiOperation({ summary: 'Search sermons by text query' })
  @ApiQuery({ name: 'q', required: true, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async searchSermons(@Query('q') q: string, @Query('limit') limit?: string) {
    return this.embeddingService.searchSermons(q, limit ? Number(limit) : 10);
  }

  @Get('similar/:sermonId')
  @ApiOperation({ summary: 'Find sermons similar to a given sermon' })
  async findSimilar(@Param('sermonId') sermonId: string) {
    return this.embeddingService.findSimilar(sermonId);
  }

  @Post('devotional/:sermonId')
  @ApiOperation({ summary: 'Generate a 5-day devotional plan from a sermon' })
  async generateDevotional(
    @Param('sermonId') sermonId: string,
    @Body() body: { transcriptText: string; sermonTitle: string },
    @Req() req: Request,
  ) {
    const userId = (req as any).context?.currentUser?.id?.toString();
    return this.devotionalService.generate(sermonId, userId, body.transcriptText, body.sermonTitle);
  }

  @Get('devotionals')
  @ApiOperation({ summary: 'Get all devotionals for the current user' })
  async getMyDevotionals(@Req() req: Request) {
    const userId = (req as any).context?.currentUser?.id?.toString();
    return this.devotionalService.findByUser(userId);
  }

  @Get('devotional/:sermonId')
  @ApiOperation({ summary: 'Get devotional for a specific sermon' })
  async getDevotional(@Param('sermonId') sermonId: string, @Req() req: Request) {
    const userId = (req as any).context?.currentUser?.id?.toString();
    return this.devotionalService.findByUserAndSermon(userId, sermonId);
  }
}
