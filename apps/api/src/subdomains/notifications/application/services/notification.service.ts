import { Injectable } from '@nestjs/common';
import { NotificationRepository } from '../../infrastructure/repositories/notification.repository';
import { Notification } from '../../domain/entities/notification.entity';
import { NotificationChannelEnum } from '../../domain/enums/notification-channel.enum';
import { NotificationTypeEnum } from '../../domain/enums/notification-type.enum';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  async sendEmail(data: {
    userId?: string;
    type: NotificationTypeEnum;
    recipient: string;
    subject: string;
    body: string;
    link?: string;
  }): Promise<Notification> {
    const notification = new Notification();
    notification.userId = data.userId ?? null;
    notification.type = data.type;
    notification.channel = NotificationChannelEnum.EMAIL;
    notification.recipient = data.recipient;
    notification.subject = data.subject;
    notification.body = data.body;
    notification.link = data.link ?? null;

    // TODO: Integrate Resend API here
    return this.notificationRepository.save(notification);
  }

  async sendPush(data: {
    userId: string;
    type: NotificationTypeEnum;
    subject: string;
    body: string;
    link?: string;
  }): Promise<Notification> {
    const notification = new Notification();
    notification.userId = data.userId;
    notification.type = data.type;
    notification.channel = NotificationChannelEnum.PUSH;
    notification.recipient = null;
    notification.subject = data.subject;
    notification.body = data.body;
    notification.link = data.link ?? null;

    // TODO: Integrate Firebase Cloud Messaging here
    return this.notificationRepository.save(notification);
  }

  async createInAppNotification(data: {
    userId: string | null;
    type: NotificationTypeEnum;
    subject: string;
    body: string;
    link?: string;
  }): Promise<Notification> {
    const notification = new Notification();
    notification.userId = data.userId;
    notification.type = data.type;
    notification.channel = NotificationChannelEnum.IN_APP;
    notification.recipient = null;
    notification.subject = data.subject;
    notification.body = data.body;
    notification.link = data.link ?? null;
    notification.isSent = true;
    notification.sentAt = new Date();
    return this.notificationRepository.save(notification);
  }

  async getUserNotifications(userId: string, page = 1, limit = 20) {
    const [notifications, total] = await this.notificationRepository.findByUserId(userId, page, limit);
    return { notifications, total };
  }

  async getUnreadCount(userId: string): Promise<number> {
    const unread = await this.notificationRepository.findUnreadByUserId(userId);
    return unread.length;
  }

  async markAsRead(notificationId: string): Promise<void> {
    await this.notificationRepository.markAsRead(notificationId);
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.notificationRepository.markAllAsRead(userId);
  }
}
