import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrayerRequest } from '../domain/entities/prayer-request.entity';
import { PrayerAgreement } from '../domain/entities/prayer-agreement.entity';
import { PrayerRecording } from '../domain/entities/prayer-recording.entity';
import { PrayerSettings } from '../domain/entities/prayer-settings.entity';
import { PrayerRequestRepository } from './repositories/prayer-request.repository';
import { PrayerRecordingRepository } from './repositories/prayer-recording.repository';
import { PrayerSettingsRepository } from './repositories/prayer-settings.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([PrayerRequest, PrayerAgreement, PrayerRecording, PrayerSettings]),
  ],
  providers: [PrayerRequestRepository, PrayerRecordingRepository, PrayerSettingsRepository],
  exports: [PrayerRequestRepository, PrayerRecordingRepository, PrayerSettingsRepository],
})
export class InfrastructureModule {}
