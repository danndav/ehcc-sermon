import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { QueueModule } from '../../../aop/queue/queue.module';
import { VideoUploadService } from './services/video-upload.service';
import { VideoStreamService } from './services/video-stream.service';
import { VideoCleanupService } from './services/video-cleanup.service';
import { TranscriptionService } from './services/transcription.service';
import { SermonTranscriptionService } from './services/sermon-transcription.service';
import { YoutubeDownloadService } from './services/youtube-download.service';

@Module({
  imports: [InfrastructureModule, QueueModule],
  providers: [VideoUploadService, VideoStreamService, VideoCleanupService, TranscriptionService, SermonTranscriptionService, YoutubeDownloadService],
  exports: [VideoUploadService, VideoStreamService, VideoCleanupService, TranscriptionService, SermonTranscriptionService, YoutubeDownloadService],
})
export class ApplicationModule {}
