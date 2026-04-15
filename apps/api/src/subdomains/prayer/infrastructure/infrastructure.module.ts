import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrayerRequest } from '../domain/entities/prayer-request.entity';
import { PrayerAgreement } from '../domain/entities/prayer-agreement.entity';
import { PrayerRecording } from '../domain/entities/prayer-recording.entity';
import { PrayerSettings } from '../domain/entities/prayer-settings.entity';
import { PrayerRequestRepository } from './repositories/prayer-request.repository';
import { PrayerAgreementRepository } from './repositories/prayer-agreement.repository';
import { PrayerRecordingRepository } from './repositories/prayer-recording.repository';
import { PrayerSettingsRepository } from './repositories/prayer-settings.repository';
import { PrayerLog } from '../domain/entities/prayer-log.entity';
import { PrayerLogRepository } from './repositories/prayer-log.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([PrayerRequest, PrayerAgreement, PrayerRecording, PrayerSettings, PrayerLog]),
  ],
  providers: [PrayerRequestRepository, PrayerAgreementRepository, PrayerRecordingRepository, PrayerSettingsRepository, PrayerLogRepository],
  exports: [PrayerRequestRepository, PrayerAgreementRepository, PrayerRecordingRepository, PrayerSettingsRepository, PrayerLogRepository],
})
export class InfrastructureModule {}
