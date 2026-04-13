import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { PrayerRequestService } from './services/prayer-request.service';
import { PrayerRecordingService } from './services/prayer-recording.service';
import { PrayerSettingsService } from './services/prayer-settings.service';

@Module({
  imports: [InfrastructureModule],
  providers: [PrayerRequestService, PrayerRecordingService, PrayerSettingsService],
  exports: [PrayerRequestService, PrayerRecordingService, PrayerSettingsService],
})
export class ApplicationModule {}
