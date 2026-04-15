import { Injectable } from '@nestjs/common';
import { PrayerSettingsRepository } from '../../infrastructure/repositories/prayer-settings.repository';

@Injectable()
export class PrayerSettingsService {
  constructor(private readonly prayerSettingsRepository: PrayerSettingsRepository) {}

  async getSettings() {
    const settings = await this.prayerSettingsRepository.getSettings();
    if (!settings) {
      // Auto-create default settings if none exist
      return this.prayerSettingsRepository.save({ meetingTime: '00:00' });
    }
    return settings;
  }

  async updateSettings(teamsLink?: string, meetingTime?: string) {
    const existing = await this.getSettings();
    return this.prayerSettingsRepository.save({
      ...existing,
      ...(teamsLink !== undefined && { teamsLink }),
      ...(meetingTime !== undefined && { meetingTime }),
    });
  }
}
