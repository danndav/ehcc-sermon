import { Module } from '@nestjs/common';
import { InfrastructureModule } from '../infrastructure/infrastructure.module';
import { GuidanceService } from './services/guidance.service';
import { EmbeddingService } from './services/embedding.service';
import { AutoTaggingService } from './services/auto-tagging.service';
import { DevotionalService } from './services/devotional.service';

@Module({
  imports: [InfrastructureModule],
  providers: [GuidanceService, EmbeddingService, AutoTaggingService, DevotionalService],
  exports: [GuidanceService, EmbeddingService, AutoTaggingService, DevotionalService],
})
export class ApplicationModule {}
