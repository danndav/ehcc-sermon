import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { QueueService } from '../../../../aop/queue/services/queue.service';
import { ServiceNoteService } from './service-note.service';
import { WORKER_ROLES } from '../../../auth/domain/enums/role.enum';

@Injectable()
export class ServiceNoteReminderService {
  private readonly logger = new Logger(ServiceNoteReminderService.name);

  constructor(
    private readonly queueService: QueueService,
    private readonly serviceNoteService: ServiceNoteService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Register repeatable cron jobs. Call once when Redis is available.
   */
  async scheduleJobs(): Promise<void> {
    try {
      // Saturday 17:00 UTC (18:00 WAT) reminder
      await this.queueService.enqueueServiceNoteReminder({
        type: 'saturday-reminder',
      });

      // Sunday 05:00 UTC (06:00 WAT) final warning
      await this.queueService.enqueueServiceNoteReminder({
        type: 'sunday-warning',
      });

      // Sunday 07:00 UTC (08:00 WAT) cleanup — delete all files & records
      await this.queueService.enqueueServiceNoteReminder({
        type: 'sunday-cleanup',
      });

      this.logger.log('Service note reminder + cleanup jobs scheduled');
    } catch (e) {
      this.logger.warn('Failed to schedule service note jobs — Redis may be down');
    }
  }

  async getWorkersWithoutSubmissions(): Promise<{ userId: string; name: string }[]> {
    const now = new Date();
    const dayOfWeek = now.getUTCDay();
    const monday = new Date(now);
    monday.setUTCDate(now.getUTCDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    monday.setUTCHours(0, 0, 0, 0);
    const sunday = new Date(monday);
    sunday.setUTCDate(monday.getUTCDate() + 6);

    const startDate = monday.toISOString().split('T')[0];
    const endDate = sunday.toISOString().split('T')[0];

    const workerRolesStr = WORKER_ROLES.map(r => `'${r}'`).join(',');

    const workers = await this.dataSource.query(`
      SELECT u.id as "userId", u.name
      FROM users u
      WHERE u.role IN (${workerRolesStr})
        AND u.deleted_at IS NULL
        AND u.id NOT IN (
          SELECT DISTINCT sn.user_id FROM service_notes sn
          WHERE sn.service_date BETWEEN $1 AND $2
            AND sn.deleted_at IS NULL
        )
    `, [startDate, endDate]);

    return workers;
  }

  async sendReminders(type: 'saturday-reminder' | 'sunday-warning'): Promise<void> {
    const workers = await this.getWorkersWithoutSubmissions();

    const body = type === 'saturday-reminder'
      ? 'Your service notes are due tomorrow by 8am. Please submit them now.'
      : 'Final reminder: You have 2 hours left to submit your service notes!';

    const subject = type === 'saturday-reminder'
      ? 'Service Notes Due Tomorrow'
      : 'Final Reminder: Service Notes Due in 2 Hours';

    for (const worker of workers) {
      await this.queueService.enqueueNotification({
        userId: worker.userId,
        type: 'SERVICE_NOTE_REMINDER',
        channel: 'push',
        subject,
        body,
        link: '/service-notes',
      });
    }

    this.logger.log(`Sent ${type} to ${workers.length} workers`);
  }

  async runCleanup(): Promise<void> {
    this.logger.log('Running Sunday 8am WAT weekly cleanup...');
    await this.serviceNoteService.weeklyCleanup();
  }
}
