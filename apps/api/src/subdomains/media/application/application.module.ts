import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { BunnyService } from './services/bunny.service';
import { TranscriptionService } from './services/transcription.service';

@Module({
  imports: [InfrastructureModule],
  providers: [BunnyService, TranscriptionService],
  exports: [BunnyService, TranscriptionService],
})
export class ApplicationModule {}
