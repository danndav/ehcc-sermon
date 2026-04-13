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
}
