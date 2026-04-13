import { Injectable } from '@nestjs/common';
import { PrayerSettingsRepository } from '../../infrastructure/repositories/prayer-settings.repository';

@Injectable()
export class PrayerSettingsService {
  constructor(private readonly prayerSettingsRepository: PrayerSettingsRepository) {}
}
