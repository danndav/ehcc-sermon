import { Injectable, Logger } from '@nestjs/common';
import { R2Client } from '../../../../aop/r2/r2.client';
import { VideoProjectRepository } from '../../infrastructure/repositories/video-project.repository';

@Injectable()
export class VideoCleanupService {
  private readonly logger = new Logger(VideoCleanupService.name);

  constructor(
    private readonly r2: R2Client,
    private readonly videoProjectRepo: VideoProjectRepository,
  ) {}

  /**
   * V-11: Delete raw files older than 30 days
   * Should be called by a scheduled job (cron)
   */
  async cleanupStaleRawFiles(): Promise<{ deleted: string[] }> {
    const staleProjects = await this.videoProjectRepo.findStaleRawFiles(30);
    const deleted: string[] = [];

    for (const project of staleProjects) {
      if (!project.rawR2Key) continue;

      try {
        await this.r2.deleteFile(project.rawR2Key);
        await this.videoProjectRepo.save({ ...project, rawDeleted: true, rawR2Key: null });
        deleted.push(project.sermonId);
        this.logger.log(`Deleted raw file for sermon ${project.sermonId}`);
      } catch (error) {
        this.logger.error(`Failed to delete raw file for sermon ${project.sermonId}`, error);
      }
    }

    // Also clean up old clips (older than 7 days)
    try {
      const clipFiles = await this.r2.listFiles('clips/');
      // Note: R2 doesn't include upload date in list — in production,
      // track clip creation dates in DB and delete from there
      this.logger.log(`Found ${clipFiles.length} clip files to evaluate`);
    } catch (error) {
      this.logger.error('Failed to list clip files for cleanup', error);
    }

    this.logger.log(`Cleanup complete: ${deleted.length} raw files deleted`);
    return { deleted };
  }

  /**
   * V-12: Get storage usage breakdown for admin dashboard
   */
  async getStorageUsage(): Promise<{
    totalBytes: number;
    processedBytes: number;
    rawBytes: number;
    clipsBytes: number;
    thumbnailsBytes: number;
  }> {
    const [processed, raw, clips, thumbnails] = await Promise.all([
      this.r2.getStorageUsed('processed/'),
      this.r2.getStorageUsed('raw/'),
      this.r2.getStorageUsed('clips/'),
      this.r2.getStorageUsed('thumbnails/'),
    ]);

    return {
      totalBytes: processed + raw + clips + thumbnails,
      processedBytes: processed,
      rawBytes: raw,
      clipsBytes: clips,
      thumbnailsBytes: thumbnails,
    };
  }
}
