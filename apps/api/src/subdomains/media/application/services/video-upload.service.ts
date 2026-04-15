import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { R2Client } from '../../../../aop/r2/r2.client';
import { QueueService } from '../../../../aop/queue/services/queue.service';
import { VideoProjectRepository } from '../../infrastructure/repositories/video-project.repository';
import { VideoProject, VideoStatusEnum } from '../../domain/entities/video-project.entity';

@Injectable()
export class VideoUploadService {
  private readonly logger = new Logger(VideoUploadService.name);

  constructor(
    private readonly r2: R2Client,
    private readonly queue: QueueService,
    private readonly videoProjectRepo: VideoProjectRepository,
  ) {}

  /**
   * V-05: Upload raw video to R2 and queue transcoding
   */
  async uploadVideo(sermonId: string, fileBuffer: Buffer, contentType: string): Promise<{ projectId: string; status: string }> {
    // Check if a project already exists for this sermon
    const existing = await this.videoProjectRepo.findBySermonId(sermonId);
    if (existing && existing.status === VideoStatusEnum.TRANSCODING) {
      throw new BadRequestException('Video is already being processed for this sermon');
    }

    const rawKey = `raw/${sermonId}/original.mp4`;

    // Upload to R2
    this.logger.log(`Uploading raw video for sermon ${sermonId} (${fileBuffer.length} bytes)`);
    await this.r2.uploadFile(rawKey, fileBuffer, contentType || 'video/mp4');

    // Create or update video project record
    const project: Partial<VideoProject> = existing || {};
    project.sermonId = sermonId;
    project.rawR2Key = rawKey;
    project.hlsPrefix = `processed/${sermonId}`;
    project.status = VideoStatusEnum.UPLOADED;
    project.errorMessage = null;
    project.fileSizeBytes = fileBuffer.length;
    project.rawDeleted = false;

    const saved = await this.videoProjectRepo.save(project);

    // Queue transcoding job
    await this.queue.enqueueVideoTranscoding({
      sermonId,
      rawR2Key: rawKey,
      outputPrefix: `processed/${sermonId}`,
      step: 'transcode',
    });

    // Update status to transcoding
    await this.videoProjectRepo.save({ ...saved, status: VideoStatusEnum.TRANSCODING });

    this.logger.log(`Video uploaded and transcoding queued for sermon ${sermonId}`);

    return { projectId: saved.id, status: 'transcoding' };
  }

  /**
   * Store a YouTube URL — no upload needed, just metadata
   */
  async importYoutubeUrl(sermonId: string, youtubeUrl: string): Promise<{ projectId: string; status: string }> {
    const project = await this.videoProjectRepo.save({
      sermonId,
      rawR2Key: null,
      hlsPrefix: null,
      status: VideoStatusEnum.READY,
      rawDeleted: true,
    });

    return { projectId: project.id, status: 'ready' };
  }

  /**
   * Get transcoding status for a video
   */
  async getStatus(sermonId: string): Promise<{ status: string; progress: Record<string, number> | null; error: string | null }> {
    const project = await this.videoProjectRepo.findBySermonId(sermonId);
    if (!project) {
      return { status: 'not_found', progress: null, error: null };
    }
    return {
      status: project.status,
      progress: project.transcodeProgress,
      error: project.errorMessage,
    };
  }
}
