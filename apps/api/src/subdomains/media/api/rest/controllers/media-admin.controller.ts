import { Body, Controller, Get, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import 'multer';
import { AuthGuard } from '../../../../../aop/authentication/guards/auth.guard';
import { RolesGuard } from '../../../../../aop/authentication/guards/roles.guard';
import { Roles } from '../../../../../aop/authentication/decorators/roles.decorator';
import { RoleEnum } from '../../../../auth/domain/enums/role.enum';
import { VideoUploadService } from '../../../application/services/video-upload.service';
import { VideoCleanupService } from '../../../application/services/video-cleanup.service';
import { SermonTranscriptionService } from '../../../application/services/sermon-transcription.service';
import { YoutubeDownloadService } from '../../../application/services/youtube-download.service';

@ApiTags('Admin / Media')
@UseGuards(AuthGuard, RolesGuard)
@Roles(RoleEnum.ADMIN)
@Controller('admin/media')
export class MediaAdminController {
  constructor(
    private readonly uploadService: VideoUploadService,
    private readonly cleanupService: VideoCleanupService,
    private readonly transcriptionService: SermonTranscriptionService,
    private readonly youtubeService: YoutubeDownloadService,
  ) {}

  @Post('upload/:sermonId')
  @ApiOperation({ summary: 'Upload a raw video file for a sermon' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: 5 * 1024 * 1024 * 1024 } })) // 5GB max
  async uploadVideo(
    @Param('sermonId') sermonId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.uploadService.uploadVideo(sermonId, file.buffer, file.mimetype);
  }

  @Post('import-youtube/:sermonId')
  @ApiOperation({ summary: 'Download YouTube video, store in R2, and queue transcription' })
  async importYoutube(
    @Param('sermonId') sermonId: string,
    @Body('youtubeUrl') youtubeUrl: string,
  ) {
    return this.youtubeService.downloadAndStore(sermonId, youtubeUrl);
  }

  @Get('youtube-info')
  @ApiOperation({ summary: 'Get YouTube video info (title, duration, thumbnail) without downloading' })
  async getYoutubeInfo(@Query('url') url: string) {
    return this.youtubeService.getVideoInfo(url);
  }

  @Get('storage')
  @ApiOperation({ summary: 'Get R2 storage usage breakdown' })
  async getStorageUsage() {
    return this.cleanupService.getStorageUsage();
  }

  @Post('cleanup')
  @ApiOperation({ summary: 'Run cleanup job for stale raw files' })
  async runCleanup() {
    return this.cleanupService.cleanupStaleRawFiles();
  }

  @Get(':sermonId/status')
  @ApiOperation({ summary: 'Get transcoding status for a sermon' })
  async getStatus(@Param('sermonId') sermonId: string) {
    return this.uploadService.getStatus(sermonId);
  }

  @Post(':sermonId/transcribe')
  @ApiOperation({ summary: 'Trigger transcription for a sermon video via AssemblyAI' })
  async transcribe(@Param('sermonId') sermonId: string) {
    return this.transcriptionService.transcribeSermon(sermonId);
  }
}
