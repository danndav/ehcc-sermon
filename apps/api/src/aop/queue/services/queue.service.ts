import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

export interface NotificationJobData {
  userId: string;
  type: string;
  channel: string;
  subject: string;
  body: string;
  link?: string;
}

export interface SermonProcessingJobData {
  sermonId: string;
  step: 'transcribe' | 'embed' | 'auto-tag';
}

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    @InjectQueue('notification-dispatch') private readonly notificationQueue: Queue,
    @InjectQueue('sermon-processing') private readonly sermonProcessingQueue: Queue,
  ) {}

  async enqueueNotification(data: NotificationJobData): Promise<void> {
    await this.notificationQueue.add('send', data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 3000 },
      removeOnComplete: true,
      removeOnFail: false,
    });
  }

  async enqueueSermonProcessing(data: SermonProcessingJobData): Promise<void> {
    await this.sermonProcessingQueue.add(data.step, data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
      removeOnComplete: true,
    });
    this.logger.log(`Sermon processing queued: ${data.step} for sermon ${data.sermonId}`);
  }
}
