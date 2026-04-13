import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { NotificationService } from '../services/notification.service';
import { NotificationChannelEnum } from '../../domain/enums/notification-channel.enum';
import { NotificationTypeEnum } from '../../domain/enums/notification-type.enum';

@Injectable()
export class NotificationEventListener {
  constructor(private readonly notificationService: NotificationService) {}

  @OnEvent('sermon.published')
  async handleSermonPublished(event: { sermonId: string; title: string; pastorName: string }): Promise<void> {
    await this.notificationService.createInAppNotification({
      userId: null,
      type: NotificationTypeEnum.NEW_SERMON,
      subject: 'New sermon available',
      body: `${event.title} by ${event.pastorName} is now available`,
      link: `/watch/${event.sermonId}`,
    });
  }

  @OnEvent('prayer.agreement')
  async handlePrayerAgreement(event: { userId: string; prayerCount: number }): Promise<void> {
    await this.notificationService.createInAppNotification({
      userId: event.userId,
      type: NotificationTypeEnum.PRAYER_AGREEMENT,
      subject: 'Someone is praying for you',
      body: `${event.prayerCount} people are now praying for your request`,
    });
  }

  @OnEvent('series.completed')
  async handleSeriesCompleted(event: { userId: string; seriesTitle: string }): Promise<void> {
    await this.notificationService.createInAppNotification({
      userId: event.userId,
      type: NotificationTypeEnum.SERIES_COMPLETED,
      subject: 'Series completed!',
      body: `You completed the ${event.seriesTitle} series! Download your certificate`,
    });
  }
}
