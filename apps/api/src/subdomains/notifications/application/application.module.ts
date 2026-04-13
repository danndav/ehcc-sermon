import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { NotificationService } from './services/notification.service';
import { NotificationEventListener } from './listeners/notification-event.listener';

@Module({
  imports: [InfrastructureModule],
  providers: [NotificationService, NotificationEventListener],
  exports: [NotificationService],
})
export class ApplicationModule {}
