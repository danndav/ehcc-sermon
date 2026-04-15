import { Injectable, Logger, NotFoundException, ForbiddenException } from '@nestjs/common';
import { R2Client } from '../../../../aop/r2/r2.client';
import { VideoProjectRepository } from '../../infrastructure/repositories/video-project.repository';
import { VideoStatusEnum } from '../../domain/entities/video-project.entity';

export interface StreamResult {
  url: string;
  isSigned: boolean;
}

@Injectable()
export class VideoStreamService {
  private readonly logger = new Logger(VideoStreamService.name);

  constructor(
    private readonly r2: R2Client,
    private readonly videoProjectRepo: VideoProjectRepository,
  ) {}

  /**
   * V-06: Get stream URL for a sermon video
   * - Free content: public CDN URL
   * - Paid content + active subscriber: signed URL (4hr expiry)
   * - Paid content + no subscription: throws ForbiddenException
   */
  async getStreamUrl(sermonId: string, options: {
    isFree: boolean;
    isSubscriber: boolean;
  }): Promise<StreamResult> {
    const project = await this.videoProjectRepo.findBySermonId(sermonId);

    if (!project) {
      throw new NotFoundException('Video not found for this sermon');
    }

    if (project.status !== VideoStatusEnum.READY) {
      throw new NotFoundException(`Video is not ready (status: ${project.status})`);
    }

    const masterKey = `${project.hlsPrefix}/master.m3u8`;

    // Free content — public CDN URL
    if (options.isFree) {
      return {
        url: this.r2.getCdnUrl(masterKey),
        isSigned: false,
      };
    }

    // Paid content — check subscription
    if (!options.isSubscriber) {
      throw new ForbiddenException({
        error: 'subscription_required',
        message: 'Subscribe to access this sermon',
        upgradeUrl: '/profile/subscription',
      });
    }

    // Paid content + subscriber — signed URL, 4 hours
    const signedUrl = await this.r2.getSignedUrl(masterKey, 4 * 60 * 60);
    this.logger.log(`Signed stream URL generated for sermon ${sermonId}`);

    return {
      url: signedUrl,
      isSigned: true,
    };
  }

  /**
   * Get thumbnail URL for a sermon
   */
  async getThumbnailUrl(sermonId: string): Promise<string | null> {
    const project = await this.videoProjectRepo.findBySermonId(sermonId);
    if (!project?.thumbnailKey) return null;
    return this.r2.getCdnUrl(project.thumbnailKey);
  }
}
