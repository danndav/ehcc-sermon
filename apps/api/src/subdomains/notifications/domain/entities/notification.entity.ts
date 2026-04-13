import { Column, Entity } from 'typeorm';
import { IEntity } from '../../../../aop/db/entities/entity';
import { NotificationChannelEnum } from '../enums/notification-channel.enum';
import { NotificationTypeEnum } from '../enums/notification-type.enum';

@Entity('notifications')
export class Notification extends IEntity {
  @Column({ type: 'uuid', nullable: true, name: 'user_id' })
  userId: string | null;

  @Column({ type: 'enum', enum: NotificationTypeEnum })
  type: NotificationTypeEnum;

  @Column({ type: 'enum', enum: NotificationChannelEnum })
  channel: NotificationChannelEnum;

  @Column({ type: 'varchar', nullable: true })
  recipient: string | null;

  @Column({ type: 'varchar', length: 255 })
  subject: string;

  @Column({ type: 'text' })
  body: string;

  @Column({ type: 'varchar', nullable: true })
  link: string | null;

  @Column({ type: 'boolean', default: false, name: 'is_sent' })
  isSent: boolean;

  @Column({ type: 'boolean', default: false, name: 'is_read' })
  isRead: boolean;

  @Column({ type: 'timestamp', nullable: true, name: 'sent_at' })
  sentAt: Date | null;

  @Column({ type: 'timestamp', nullable: true, name: 'read_at' })
  readAt: Date | null;

  @Column({ type: 'varchar', nullable: true, name: 'provider_message_id' })
  providerMessageId: string | null;

  @Column({ type: 'varchar', nullable: true, name: 'error_message' })
  errorMessage: string | null;
}
