import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../../domain/entities/notification.entity';
import { NotificationChannelEnum } from '../../domain/enums/notification-channel.enum';

@Injectable()
export class NotificationRepository {
  constructor(
    @InjectRepository(Notification)
    private readonly repository: Repository<Notification>,
  ) {}

  async save(notification: Notification): Promise<Notification> {
    return this.repository.save(notification);
  }

  async findById(id: string): Promise<Notification | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByUserId(userId: string, page = 1, limit = 20): Promise<[Notification[], number]> {
    return this.repository.findAndCount({
      where: { userId, channel: NotificationChannelEnum.IN_APP },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findUnreadByUserId(userId: string): Promise<Notification[]> {
    return this.repository.find({
      where: { userId, channel: NotificationChannelEnum.IN_APP, isRead: false },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: string): Promise<void> {
    await this.repository.update(id, { isRead: true, readAt: new Date() });
  }

  async markAllAsRead(userId: string): Promise<void> {
    await this.repository.update(
      { userId, channel: NotificationChannelEnum.IN_APP, isRead: false },
      { isRead: true, readAt: new Date() },
    );
  }

  async update(id: string, data: Partial<Notification>): Promise<void> {
    await this.repository.update(id, data);
  }
}
