import { Injectable, Logger, Optional } from '@nestjs/common';
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

export interface VideoProcessingJobData {
  sermonId: string;
  rawR2Key: string;
  outputPrefix: string;
  step: 'transcode' | 'thumbnail' | 'clip' | 'cleanup';
}

export interface ServiceNoteReminderJobData {
  type: 'saturday-reminder' | 'sunday-warning' | 'sunday-cleanup';
}

export interface VideoClipJobData {
  sermonId: string;
  clipId: string;
  startMs: number;
  endMs: number;
  format: 'mp4' | 'mp3' | '9x16' | '1x1';
  outputKey: string;
}

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    @Optional() @InjectQueue('notification-dispatch') private readonly notificationQueue: Queue,
    @Optional() @InjectQueue('sermon-processing') private readonly sermonProcessingQueue: Queue,
    @Optional() @InjectQueue('video-processing') private readonly videoProcessingQueue: Queue,
    @Optional() @InjectQueue('service-note-reminders') private readonly serviceNoteRemindersQueue: Queue,
  ) {}

  private async safeAdd(queue: Queue | undefined, name: string, data: any, opts: any): Promise<void> {
    if (!queue) {
      this.logger.warn(`Queue not available — skipping job: ${name}`);
      return;
    }
    try {
      await queue.add(name, data, opts);
    } catch (error) {
      this.logger.warn(`Failed to queue job ${name} — Redis may be down`);
    }
  }

  async enqueueNotification(data: NotificationJobData): Promise<void> {
    await this.safeAdd(this.notificationQueue, 'send', data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 3000 },
      removeOnComplete: true,
      removeOnFail: false,
    });
  }

  async enqueueSermonProcessing(data: SermonProcessingJobData): Promise<void> {
    await this.safeAdd(this.sermonProcessingQueue, data.step, data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
      removeOnComplete: true,
    });
    this.logger.log(`Sermon processing queued: ${data.step} for sermon ${data.sermonId}`);
  }

  async enqueueVideoTranscoding(data: VideoProcessingJobData): Promise<void> {
    await this.safeAdd(this.videoProcessingQueue, 'transcode', data, {
      attempts: 2,
      backoff: { type: 'exponential', delay: 10000 },
      removeOnComplete: true,
    });
    this.logger.log(`Video transcoding queued for sermon ${data.sermonId}`);
  }

  async enqueueVideoClip(data: VideoClipJobData): Promise<void> {
    await this.safeAdd(this.videoProcessingQueue, 'clip', data, {
      attempts: 2,
      backoff: { type: 'exponential', delay: 5000 },
      removeOnComplete: true,
    });
  }

  async enqueueVideoThumbnail(sermonId: string): Promise<void> {
    await this.safeAdd(this.videoProcessingQueue, 'thumbnail', { sermonId, step: 'thumbnail' }, {
      attempts: 2,
      removeOnComplete: true,
    });
  }

  async enqueueServiceNoteReminder(data: ServiceNoteReminderJobData): Promise<void> {
    let cronPattern: string;
    if (data.type === 'saturday-reminder') {
      cronPattern = '0 17 * * 6';  // Saturday 17:00 UTC (18:00 WAT)
    } else if (data.type === 'sunday-warning') {
      cronPattern = '0 5 * * 0';   // Sunday 05:00 UTC (06:00 WAT)
    } else {
      cronPattern = '0 7 * * 0';   // Sunday 07:00 UTC (08:00 WAT) — cleanup
    }

    await this.safeAdd(this.serviceNoteRemindersQueue, data.type, data, {
      repeat: { pattern: cronPattern },
      removeOnComplete: true,
    });
  }
}
