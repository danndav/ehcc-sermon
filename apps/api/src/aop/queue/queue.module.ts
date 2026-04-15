import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { QueueService } from './services/queue.service';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || undefined,
        maxRetriesPerRequest: null,
        retryStrategy: (times: number) => {
          if (times > 3) return null; // stop retrying
          return Math.min(times * 1000, 5000);
        },
        lazyConnect: true,
      },
    }),
    BullModule.registerQueue(
      { name: 'notification-dispatch' },
      { name: 'sermon-processing' },
      { name: 'video-processing' },
      { name: 'service-note-reminders' },
    ),
  ],
  providers: [QueueService],
  exports: [BullModule, QueueService],
})
export class QueueModule {}
