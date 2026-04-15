import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { PrayerRequestService } from './services/prayer-request.service';
import { PrayerRecordingService } from './services/prayer-recording.service';
import { PrayerSettingsService } from './services/prayer-settings.service';
import { PrayerLogService } from './services/prayer-log.service';

@Module({
  imports: [InfrastructureModule],
  providers: [PrayerRequestService, PrayerRecordingService, PrayerSettingsService, PrayerLogService],
  exports: [PrayerRequestService, PrayerRecordingService, PrayerSettingsService, PrayerLogService],
})
export class ApplicationModule {}
