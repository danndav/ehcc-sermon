import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DbModule } from './aop/db/db.module';
import { QueueModule } from './aop/queue/queue.module';
import { AuthModule } from './subdomains/auth/auth.module';
import { SermonsModule } from './subdomains/sermons/sermons.module';
import { PrayerModule } from './subdomains/prayer/prayer.module';
import { SubscriptionsModule } from './subdomains/subscriptions/subscriptions.module';
import { AiModule } from './subdomains/ai/ai.module';
import { MediaModule } from './subdomains/media/media.module';
import { NotificationsModule } from './subdomains/notifications/notifications.module';

@Module({
  imports: [
    DbModule,
    EventEmitterModule.forRoot(),
    QueueModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
    AuthModule,
    SermonsModule,
    PrayerModule,
    SubscriptionsModule,
    AiModule,
    MediaModule,
    NotificationsModule,
  ],
})
export class RootModule {}
