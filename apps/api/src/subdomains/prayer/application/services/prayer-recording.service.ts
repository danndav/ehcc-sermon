import { Injectable } from '@nestjs/common';
import { PrayerRecordingRepository } from '../../infrastructure/repositories/prayer-recording.repository';

@Injectable()
export class PrayerRecordingService {
  constructor(private readonly prayerRecordingRepository: PrayerRecordingRepository) {}
}
