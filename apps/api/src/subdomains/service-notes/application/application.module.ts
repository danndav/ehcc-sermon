import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { QueueModule } from '../../../aop/queue/queue.module';
import { ServiceNoteService } from './services/service-note.service';
import { ServiceNoteReminderService } from './services/service-note-reminder.service';

@Module({
  imports: [InfrastructureModule, QueueModule],
  providers: [ServiceNoteService, ServiceNoteReminderService],
  exports: [ServiceNoteService, ServiceNoteReminderService],
})
export class ApplicationModule {}
