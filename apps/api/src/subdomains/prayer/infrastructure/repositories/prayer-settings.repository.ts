import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrayerSettings } from '../../domain/entities/prayer-settings.entity';

@Injectable()
export class PrayerSettingsRepository {
  constructor(
    @InjectRepository(PrayerSettings)
    private readonly repo: Repository<PrayerSettings>,
  ) {}

  async getSettings(): Promise<PrayerSettings | null> {
    return this.repo.findOne({ where: {}, order: { createdAt: 'ASC' } });
  }

  async save(data: Partial<PrayerSettings>): Promise<PrayerSettings> {
    return this.repo.save(data);
  }
}
