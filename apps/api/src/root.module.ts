import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { DbModule } from './aop/db/db.module';
import { QueueModule } from './aop/queue/queue.module';
import { R2Module } from './aop/r2/r2.module';
import { AuthModule } from './subdomains/auth/auth.module';
import { SermonsModule } from './subdomains/sermons/sermons.module';
import { PrayerModule } from './subdomains/prayer/prayer.module';
import { SubscriptionsModule } from './subdomains/subscriptions/subscriptions.module';
import { AiModule } from './subdomains/ai/ai.module';
import { MediaModule } from './subdomains/media/media.module';
import { NotificationsModule } from './subdomains/notifications/notifications.module';
import { BranchesModule } from './subdomains/branches/branches.module';
import { ServiceNotesModule } from './subdomains/service-notes/service-notes.module';
import { MinistryGuideModule } from './subdomains/ministry-guide/ministry-guide.module';

@Module({
  imports: [
    DbModule,
    R2Module,
    EventEmitterModule.forRoot(),
    QueueModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
    AuthModule,
    BranchesModule,
    SermonsModule,
    PrayerModule,
    SubscriptionsModule,
    AiModule,
    MediaModule,
    NotificationsModule,
    ServiceNotesModule,
    MinistryGuideModule,
  ],
})
export class RootModule {}
