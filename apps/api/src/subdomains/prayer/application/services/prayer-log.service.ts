import { Injectable, BadRequestException } from '@nestjs/common';
import { PrayerLogRepository } from '../../infrastructure/repositories/prayer-log.repository';
import { PrayerLog } from '../../domain/entities/prayer-log.entity';

@Injectable()
export class PrayerLogService {
  constructor(private readonly repo: PrayerLogRepository) {}

  async submitLogs(userId: number, prayerLogs: { startTime: string; endTime: string }[]): Promise<PrayerLog[]> {
    if (!prayerLogs || prayerLogs.length === 0) {
      throw new BadRequestException('At least one prayer time slot is required');
    }

    const entities = prayerLogs.map(slot => {
      const duration = this.calculateDuration(slot.startTime, slot.endTime);
      if (duration <= 0 || duration >= 720) {
        throw new BadRequestException(`Invalid time slot: ${slot.startTime} - ${slot.endTime}. Duration must be between 1 minute and 12 hours.`);
      }
      return {
        userId,
        startTime: slot.startTime,
        endTime: slot.endTime,
        durationMinutes: duration,
      };
    });

    return this.repo.createMany(entities);
  }

  async getTodayLogs(userId: number): Promise<PrayerLog[]> {
    return this.repo.findByUserToday(userId);
  }

  async getHistory(userId: number, page?: number, limit?: number) {
    const [data, total] = await this.repo.findByUser(userId, page, limit);
    return { data, total };
  }

  async getTotalMinutes(userId: number): Promise<number> {
    return this.repo.getTotalMinutesByUser(userId);
  }

  async getAllLogs(page?: number, limit?: number) {
    const [data, total] = await this.repo.findAll(page, limit);
    return { data, total };
  }

  private calculateDuration(start: string, end: string): number {
    const [sh, sm] = start.split(':').map(Number);
    const [eh, em] = end.split(':').map(Number);
    const startMins = sh * 60 + sm;
    const endMins = eh * 60 + em;
    // Midnight wrap support
    return (endMins - startMins + 24 * 60) % (24 * 60);
  }
}
